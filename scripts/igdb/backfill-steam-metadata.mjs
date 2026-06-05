#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";

const IGDB_BASE_URL = "https://api.igdb.com/v4";
const TWITCH_OAUTH_TOKEN_URL = "https://id.twitch.tv/oauth2/token";
const DATA_DIR = path.resolve(process.cwd(), "scripts/igdb/data");
const REPORT_PATH = path.join(DATA_DIR, "steam-metadata-backfill.report.json");
const GAME_CACHE_KEY_PREFIX = "game:";
const STEAM_SOURCE_ID = 1;

const SOURCE_MAP = {
  steam: STEAM_SOURCE_ID,
};

const LOOKUP_RESOURCE_FIELDS = {
  external_game_sources: "id,name,checksum,updated_at",
  game_modes: "id,name,slug,url,checksum,updated_at",
  genres: "id,name,slug,url,checksum,updated_at",
  platforms:
    "id,name,slug,url,abbreviation,alternative_name,generation,platform_family,platform_logo,platform_type,summary,checksum,updated_at",
  player_perspectives: "id,name,slug,url,checksum,updated_at",
  themes: "id,name,slug,url,checksum,updated_at",
  website_types: "id,type,checksum,updated_at",
};

const BY_GAME_RESOURCE_FIELDS = {
  artworks: "id,game,image_id,width,height,alpha_channel,animated,url,checksum,artwork_type",
  covers: "id,game,image_id,width,height,alpha_channel,animated,url,checksum",
  game_videos: "id,game,name,video_id,checksum",
  involved_companies: "id,game,company,developer,publisher,porting,supporting,checksum",
  multiplayer_modes:
    "id,game,platform,campaigncoop,dropin,lancoop,offlinecoop,offlinecoopmax,offlinemax,onlinecoop,onlinecoopmax,onlinemax,splitscreen,splitscreenonline,checksum",
  screenshots: "id,game,image_id,width,height,alpha_channel,animated,url,checksum",
  websites: "id,game,type,url,trusted,checksum",
};

const GAME_FIELDS = [
  "id",
  "name",
  "slug",
  "url",
  "summary",
  "storyline",
  "rating",
  "rating_count",
  "aggregated_rating",
  "aggregated_rating_count",
  "total_rating",
  "total_rating_count",
  "checksum",
  "updated_at",
  "version_title",
  "age_ratings",
  "alternative_names",
  "artworks",
  "bundles",
  "collections",
  "cover",
  "external_games",
  "first_release_date",
  "franchise",
  "franchises",
  "game_engines",
  "game_modes",
  "game_status",
  "game_type",
  "genres",
  "keywords",
  "language_supports",
  "multiplayer_modes",
  "parent_game",
  "platforms",
  "player_perspectives",
  "similar_games",
  "themes",
  "version_parent",
  "videos",
  "websites",
].join(",");

const DEFAULT_DESKTOP_DB_PATH = path.join(
  homedir(),
  "Library",
  "Application Support",
  "stakload-data",
  "databases",
  "stakload.db",
);

const printHelp = () => {
  console.log(`Backfill local Steam metadata from real IGDB data

Usage:
  task igdb:backfill-steam-metadata -- [options]
  node scripts/igdb/backfill-steam-metadata.mjs [options]

Options:
  --source <slug>                 Source slug (default: steam)
  --external-game-id <id>         External store id. Repeat or comma-separate.
  --desktop-db <path>             SQLite DB path for desktop-owned ids.
  --limit <number|all>            Max desktop ids to backfill (default: 50)
  --env-file <path>               Env file path (default: .env)
  --api-base-url <url>            API base URL (default: PUBLIC_WEBHOOK_BASE_URL or localhost)
  --webhook-secret <value>        Webhook secret (default: IGDB_WEBHOOK_SECRET or webhook-secret)
  --post-concurrency <number>     Concurrent webhook posts (default: 8)
  --job-timeout-ms <number>       Redis cache wait timeout (default: 120000)
  --help                          Show help
`);
};

const parseArgs = (argv) => {
  const options = {
    apiBaseUrl: null,
    desktopDb: DEFAULT_DESKTOP_DB_PATH,
    envFile: ".env",
    externalGameIds: [],
    help: false,
    jobTimeoutMs: 120_000,
    limit: 50,
    postConcurrency: 8,
    source: "steam",
    webhookSecret: null,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--help" || arg === "-h") {
      options.help = true;
      continue;
    }

    if (arg === "--source") {
      options.source = argv[index + 1] ?? options.source;
      index += 1;
      continue;
    }

    if (arg === "--external-game-id") {
      const raw = argv[index + 1] ?? "";
      options.externalGameIds.push(...raw.split(",").map((entry) => entry.trim()).filter(Boolean));
      index += 1;
      continue;
    }

    if (arg === "--desktop-db") {
      options.desktopDb = argv[index + 1] ?? options.desktopDb;
      index += 1;
      continue;
    }

    if (arg === "--limit") {
      const raw = argv[index + 1] ?? "";
      options.limit = raw === "all" ? "all" : Number.parseInt(raw, 10);
      index += 1;
      continue;
    }

    if (arg === "--env-file") {
      options.envFile = argv[index + 1] ?? options.envFile;
      index += 1;
      continue;
    }

    if (arg === "--api-base-url") {
      options.apiBaseUrl = argv[index + 1] ?? null;
      index += 1;
      continue;
    }

    if (arg === "--webhook-secret") {
      options.webhookSecret = argv[index + 1] ?? null;
      index += 1;
      continue;
    }

    if (arg === "--post-concurrency") {
      options.postConcurrency = Number.parseInt(argv[index + 1] ?? "", 10);
      index += 1;
      continue;
    }

    if (arg === "--job-timeout-ms") {
      options.jobTimeoutMs = Number.parseInt(argv[index + 1] ?? "", 10);
      index += 1;
    }
  }

  return options;
};

const loadEnvFile = (filePath) => {
  const absolutePath = path.resolve(process.cwd(), filePath);
  const values = {};

  if (!existsSync(absolutePath)) {
    return values;
  }

  for (const line of readFileSync(absolutePath, "utf8").split(/\r?\n/u)) {
    const trimmed = line.trim();
    if (trimmed.length === 0 || trimmed.startsWith("#")) continue;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex < 0) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    values[key] = value;
  }

  return values;
};

const resolveEnvVariable = (name, envFileValues) => {
  const processValue = process.env[name];
  if (typeof processValue === "string" && processValue.length > 0) return processValue;

  const fileValue = envFileValues[name];
  if (typeof fileValue === "string" && fileValue.length > 0) return fileValue;

  return null;
};

const buildConfig = (options) => {
  const envFileValues = loadEnvFile(options.envFile);
  const apiWebhookPort = resolveEnvVariable("API_WEBHOOK_PORT", envFileValues) ?? "3001";
  const apiBaseUrl =
    options.apiBaseUrl ??
    resolveEnvVariable("PUBLIC_WEBHOOK_BASE_URL", envFileValues) ??
    `http://localhost:${apiWebhookPort}`;

  if (!Number.isInteger(options.postConcurrency) || options.postConcurrency < 1) {
    throw new Error("--post-concurrency must be a positive integer");
  }

  if (!Number.isInteger(options.jobTimeoutMs) || options.jobTimeoutMs < 1_000) {
    throw new Error("--job-timeout-ms must be at least 1000");
  }

  if (options.limit !== "all" && (!Number.isInteger(options.limit) || options.limit < 1)) {
    throw new Error("--limit must be a positive integer or all");
  }

  const sourceId = SOURCE_MAP[options.source];
  if (!sourceId) {
    throw new Error(`Unsupported source ${options.source}`);
  }

  return {
    apiBaseUrl,
    desktopDb: path.resolve(options.desktopDb),
    externalGameIds: uniqueStrings(options.externalGameIds),
    igdbClientId: resolveEnvVariable("IGDB_CLIENT_ID", envFileValues),
    igdbClientSecret: resolveEnvVariable("IGDB_CLIENT_SECRET", envFileValues),
    jobTimeoutMs: options.jobTimeoutMs,
    limit: options.limit,
    postConcurrency: options.postConcurrency,
    source: options.source,
    sourceId,
    webhookSecret:
      options.webhookSecret ?? resolveEnvVariable("IGDB_WEBHOOK_SECRET", envFileValues) ?? "webhook-secret",
  };
};

const ensureDataDirectory = () => {
  mkdirSync(DATA_DIR, { recursive: true });
};

const writeJson = (filePath, value) => {
  ensureDataDirectory();
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
};

const uniqueStrings = (values) => [...new Set(values.map(String).filter((value) => value.length > 0))];

const uniqueIntegers = (values) => [
  ...new Set(values.filter((value) => Number.isInteger(value) && value > 0)),
].sort((left, right) => left - right);

const chunk = (items, size) => {
  const chunks = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
};

const quoteIgdbString = (value) => `"${String(value).replaceAll("\\", "\\\\").replaceAll('"', '\\"')}"`;

const buildIdTuple = (ids) => `(${ids.join(",")})`;

const buildStringTuple = (values) => `(${values.map(quoteIgdbString).join(",")})`;

const runWithConcurrency = async (items, concurrency, callback) => {
  let nextIndex = 0;
  const workers = Array.from({ length: concurrency }).map(async () => {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      await callback(items[currentIndex], currentIndex);
    }
  });

  await Promise.all(workers);
};

const fetchAccessToken = async (clientId, clientSecret) => {
  const url = new URL(TWITCH_OAUTH_TOKEN_URL);
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("client_secret", clientSecret);
  url.searchParams.set("grant_type", "client_credentials");

  const response = await fetch(url, { method: "POST" });
  const payload = await response.json();

  if (!response.ok || typeof payload.access_token !== "string") {
    throw new Error(`Failed to fetch Twitch access token (status ${response.status})`);
  }

  return payload.access_token;
};

const queryIgdb = async ({ accessToken, clientId, query, resource }) => {
  const response = await fetch(`${IGDB_BASE_URL}/${resource}`, {
    body: query,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
      "Client-ID": clientId,
      "Content-Type": "text/plain",
    },
    method: "POST",
  });
  const text = await response.text();

  let parsedBody = text;
  try {
    parsedBody = JSON.parse(text);
  } catch {}

  if (!response.ok) {
    const errorBody = typeof parsedBody === "string" ? parsedBody : JSON.stringify(parsedBody, null, 2);
    throw new Error(`IGDB request failed for ${resource} (status ${response.status})\n${errorBody}`);
  }

  return Array.isArray(parsedBody) ? parsedBody : [];
};

const queryIgdbAll = async ({ accessToken, clientId, fields, resource, where, sort = "id asc" }) => {
  const rows = [];
  const pageSize = 500;

  for (let offset = 0; ; offset += pageSize) {
    const query = [`fields ${fields};`, `where ${where};`, `sort ${sort};`, `limit ${pageSize};`, `offset ${offset};`].join(
      " ",
    );
    const page = await queryIgdb({
      accessToken,
      clientId,
      query,
      resource,
    });

    rows.push(...page);

    if (page.length < pageSize) {
      return rows;
    }
  }
};

const readDesktopExternalGameIds = (config) => {
  if (!existsSync(config.desktopDb)) {
    throw new Error(`Desktop database not found at ${config.desktopDb}`);
  }

  const limitClause = config.limit === "all" ? "" : ` LIMIT ${config.limit}`;
  const sql = [
    "SELECT DISTINCT gameId",
    "FROM games",
    `WHERE library = '${config.source}'`,
    "AND archivedAt IS NULL",
    "AND gameId IS NOT NULL",
    "AND length(gameId) > 0",
    "ORDER BY name ASC",
    limitClause,
  ].join(" ");

  const output = execFileSync("sqlite3", [config.desktopDb, sql], {
    encoding: "utf8",
  });

  return uniqueStrings(output.split(/\r?\n/u).map((line) => line.trim()));
};

const resolveExternalGameIds = (config) => {
  if (config.externalGameIds.length) {
    return config.externalGameIds;
  }

  return readDesktopExternalGameIds(config);
};

const fetchExternalGames = async ({ accessToken, config, externalGameIds }) => {
  const rows = [];

  for (const batch of chunk(externalGameIds, 500)) {
    const page = await queryIgdbAll({
      accessToken,
      clientId: config.igdbClientId,
      fields:
        "id,uid,name,game,external_game_source,game_release_format,platform,url,year,countries,checksum,updated_at",
      resource: "external_games",
      where: `external_game_source = ${config.sourceId} & uid = ${buildStringTuple(batch)}`,
    });
    rows.push(...page);
  }

  return rows.filter((entry) => Number.isInteger(entry.id) && Number.isInteger(entry.game) && entry.uid);
};

const fetchByIds = async ({ accessToken, clientId, fields, ids, resource }) => {
  const uniqueIds = uniqueIntegers(ids);
  const rows = [];

  for (const batch of chunk(uniqueIds, 500)) {
    const page = await queryIgdbAll({
      accessToken,
      clientId,
      fields,
      resource,
      where: `id = ${buildIdTuple(batch)}`,
    });
    rows.push(...page);
  }

  return rows;
};

const fetchByGameIds = async ({ accessToken, clientId, fields, gameIds, resource }) => {
  const uniqueGameIds = uniqueIntegers(gameIds);
  const rows = [];

  for (const batch of chunk(uniqueGameIds, 500)) {
    const page = await queryIgdbAll({
      accessToken,
      clientId,
      fields,
      resource,
      where: `game = ${buildIdTuple(batch)}`,
    });
    rows.push(...page);
  }

  return rows;
};

const addIds = (target, values) => {
  if (!Array.isArray(values)) return;
  for (const value of values) {
    if (Number.isInteger(value)) target.add(value);
    if (value && typeof value === "object" && Number.isInteger(value.id)) target.add(value.id);
  }
};

const addId = (target, value) => {
  if (Number.isInteger(value)) target.add(value);
  if (value && typeof value === "object" && Number.isInteger(value.id)) target.add(value.id);
};

const collectGameLookupIds = (games) => {
  const lookups = {
    game_modes: new Set(),
    genres: new Set(),
    platforms: new Set(),
    player_perspectives: new Set(),
    themes: new Set(),
  };

  for (const game of games) {
    addIds(lookups.game_modes, game.game_modes);
    addIds(lookups.genres, game.genres);
    addIds(lookups.platforms, game.platforms);
    addIds(lookups.player_perspectives, game.player_perspectives);
    addIds(lookups.themes, game.themes);
  }

  return lookups;
};

const postWebhookPayload = async ({ action = "create", apiBaseUrl, payload, resource, secret }) => {
  const response = await fetch(`${apiBaseUrl}/webhooks/${resource}/${action}`, {
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
      "x-secret": secret,
    },
    method: "POST",
  });
  const text = await response.text();

  if (response.status !== 204) {
    throw new Error(`${resource}/${action} failed for id ${payload.id} with status ${response.status}: ${text}`);
  }
};

const postResource = async ({ config, payloads, resource }) => {
  if (!payloads.length) return 0;

  let posted = 0;
  await runWithConcurrency(payloads, config.postConcurrency, async (payload) => {
    await postWebhookPayload({
      apiBaseUrl: config.apiBaseUrl,
      payload,
      resource,
      secret: config.webhookSecret,
    });
    posted += 1;
  });

  console.log(`Posted ${posted} ${resource} webhook payloads`);
  return posted;
};

const waitForCacheKeys = async ({ config, gameIds }) => {
  const startedAt = Date.now();
  const pending = new Set(gameIds.map(String));

  while (pending.size > 0 && Date.now() - startedAt < config.jobTimeoutMs) {
    const redisRows = execFileSync(
      "docker",
      ["exec", "stakload-redis", "redis-cli", "-a", "stakload", "MGET", ...[...pending].map((id) => `${GAME_CACHE_KEY_PREFIX}${id}`)],
      { encoding: "utf8" },
    )
      .split(/\r?\n/u)
      .map((line) => line.trim())
      .filter(Boolean);

    const pendingIds = [...pending];
    redisRows.forEach((value, index) => {
      if (value !== "(nil)") {
        pending.delete(pendingIds[index]);
      }
    });

    if (pending.size === 0) break;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  return {
    cached: gameIds.length - pending.size,
    pending: [...pending].map(Number),
  };
};

const main = async () => {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    return;
  }

  const config = buildConfig(options);
  if (!config.igdbClientId || !config.igdbClientSecret) {
    throw new Error("IGDB_CLIENT_ID and IGDB_CLIENT_SECRET are required");
  }

  const startedAt = new Date().toISOString();
  console.log(`Backfilling ${config.source} metadata through ${config.apiBaseUrl}`);

  const externalGameIds = resolveExternalGameIds(config);
  if (!externalGameIds.length) {
    throw new Error("No external game ids were provided or found in the desktop DB");
  }
  console.log(`Resolved ${externalGameIds.length} ${config.source} external ids`);

  const accessToken = await fetchAccessToken(config.igdbClientId, config.igdbClientSecret);
  const externalGames = await fetchExternalGames({ accessToken, config, externalGameIds });
  const matchedExternalIds = uniqueStrings(externalGames.map((entry) => String(entry.uid)));
  const gameIds = uniqueIntegers(externalGames.map((entry) => entry.game));
  console.log(`IGDB matched ${matchedExternalIds.length}/${externalGameIds.length} external ids to ${gameIds.length} games`);

  if (!gameIds.length) {
    throw new Error("IGDB did not return any game mappings");
  }

  const games = await fetchByIds({
    accessToken,
    clientId: config.igdbClientId,
    fields: GAME_FIELDS,
    ids: gameIds,
    resource: "games",
  });
  console.log(`Fetched ${games.length} games`);

  const lookups = collectGameLookupIds(games);
  const resources = {
    external_game_sources: [{ id: config.sourceId, name: config.source }],
  };

  for (const [resource, ids] of Object.entries(lookups)) {
    resources[resource] = await fetchByIds({
      accessToken,
      clientId: config.igdbClientId,
      fields: LOOKUP_RESOURCE_FIELDS[resource],
      ids: [...ids],
      resource,
    });
  }

  for (const [resource, fields] of Object.entries(BY_GAME_RESOURCE_FIELDS)) {
    resources[resource] = await fetchByGameIds({
      accessToken,
      clientId: config.igdbClientId,
      fields,
      gameIds,
      resource,
    });
  }

  const companyIds = new Set();
  for (const involvedCompany of resources.involved_companies) {
    addId(companyIds, involvedCompany.company);
  }
  resources.companies = await fetchByIds({
    accessToken,
    clientId: config.igdbClientId,
    fields: "id,name,slug,url,description,country,logo,checksum,updated_at",
    ids: [...companyIds],
    resource: "companies",
  });

  const websiteTypeIds = new Set();
  for (const website of resources.websites) {
    addId(websiteTypeIds, website.type);
  }
  const fetchedWebsiteTypes = await fetchByIds({
    accessToken,
    clientId: config.igdbClientId,
    fields: LOOKUP_RESOURCE_FIELDS.website_types,
    ids: [...websiteTypeIds],
    resource: "website_types",
  });
  resources.website_types = fetchedWebsiteTypes;

  const postCounts = {};
  const postOrder = [
    "external_game_sources",
    "genres",
    "platforms",
    "game_modes",
    "player_perspectives",
    "themes",
    "website_types",
    "companies",
    "covers",
    "artworks",
    "screenshots",
    "game_videos",
    "websites",
    "involved_companies",
  ];

  for (const resource of postOrder) {
    postCounts[resource] = await postResource({
      config,
      payloads: resources[resource] ?? [],
      resource,
    });
  }

  postCounts.external_games = await postResource({
    config,
    payloads: externalGames,
    resource: "external_games",
  });
  postCounts.games = await postResource({
    config,
    payloads: games,
    resource: "games",
  });

  const cacheStatus = await waitForCacheKeys({ config, gameIds });
  const report = {
    cacheStatus,
    completedAt: new Date().toISOString(),
    externalGameIds: {
      matched: matchedExternalIds.length,
      requested: externalGameIds.length,
      unmatched: externalGameIds.filter((id) => !matchedExternalIds.includes(id)),
    },
    gameIds,
    postCounts,
    source: config.source,
    startedAt,
  };

  writeJson(REPORT_PATH, report);
  console.log(`Cached ${cacheStatus.cached}/${gameIds.length} games`);
  console.log(`Wrote report: ${path.relative(process.cwd(), REPORT_PATH)}`);
};

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
});
