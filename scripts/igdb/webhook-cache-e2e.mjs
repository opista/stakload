#!/usr/bin/env node

import { createRequire } from "node:module";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const workerBuilderRequire = createRequire(path.resolve(process.cwd(), "apps/worker-builder/package.json"));

const GAME_BUILD_IN_PROGRESS_SET_KEY = "game-build:in-progress";
const GAME_BUILD_QUEUE_NAME = "game-build-queue";
const IGDB_BASE_URL = "https://api.igdb.com/v4";
const TWITCH_OAUTH_TOKEN_URL = "https://id.twitch.tv/oauth2/token";

const DATA_DIR = path.resolve(process.cwd(), "scripts/igdb/data");
const GENRE_DUMP_PATH = path.join(DATA_DIR, "genres.dump.json");
const GAME_CREATE_PAYLOAD_PATH = path.join(DATA_DIR, "game.create.payload.json");
const GAME_UPDATE_PAYLOAD_PATH = path.join(DATA_DIR, "game.update.payload.json");
const REPORT_PATH = path.join(DATA_DIR, "webhook-cache-e2e.report.json");

const STAGES = new Set(["preflight", "genres", "create", "full"]);

const printHelp = () => {
  console.log(`Local webhook->worker->redis E2E harness

Usage:
  task igdb:e2e:webhook-cache
  node scripts/igdb/webhook-cache-e2e.mjs [options]

Stages:
  preflight  Validate env + connectivity only
  genres     Preflight + genre dump + ingest checks
  create     Genres stage + game create + Postgres check
  full       Complete flow including queue + redis + game update checks

Options:
  --stage <name>                  One of: preflight, genres, create, full (default: full)
  --env-file <path>               Env file path (default: .env)
  --api-base-url <url>            API base URL (default: PUBLIC_WEBHOOK_BASE_URL or http://localhost:API_WEBHOOK_PORT)
  --database-url <url>            Postgres URL (default: DATABASE_URL)
  --redis-host <host>             Redis host (default: REDIS_HOST, normalised for host execution)
  --redis-port <number>           Redis port (default: REDIS_PORT)
  --redis-password <value>        Redis password (default: REDIS_PASSWORD)
  --genre-page-size <number>      IGDB genre page size (default: 500)
  --post-concurrency <number>     Concurrent webhook posts (default: 10)
  --job-timeout-ms <number>       Queue job wait timeout (default: 60000)
  --help                          Show this help
`);
};

const parseArgs = (argv) => {
  const options = {
    apiBaseUrl: null,
    databaseUrl: null,
    envFile: ".env",
    genrePageSize: 500,
    help: false,
    jobTimeoutMs: 60_000,
    postConcurrency: 10,
    redisHost: null,
    redisPassword: null,
    redisPort: null,
    stage: "full",
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--help" || arg === "-h") {
      options.help = true;
      continue;
    }

    if (arg === "--stage") {
      options.stage = argv[index + 1] ?? options.stage;
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

    if (arg === "--database-url") {
      options.databaseUrl = argv[index + 1] ?? null;
      index += 1;
      continue;
    }

    if (arg === "--redis-host") {
      options.redisHost = argv[index + 1] ?? null;
      index += 1;
      continue;
    }

    if (arg === "--redis-port") {
      const value = Number.parseInt(argv[index + 1] ?? "", 10);
      options.redisPort = Number.isFinite(value) ? value : null;
      index += 1;
      continue;
    }

    if (arg === "--redis-password") {
      options.redisPassword = argv[index + 1] ?? null;
      index += 1;
      continue;
    }

    if (arg === "--genre-page-size") {
      const value = Number.parseInt(argv[index + 1] ?? "", 10);
      options.genrePageSize = Number.isFinite(value) ? value : options.genrePageSize;
      index += 1;
      continue;
    }

    if (arg === "--post-concurrency") {
      const value = Number.parseInt(argv[index + 1] ?? "", 10);
      options.postConcurrency = Number.isFinite(value) ? value : options.postConcurrency;
      index += 1;
      continue;
    }

    if (arg === "--job-timeout-ms") {
      const value = Number.parseInt(argv[index + 1] ?? "", 10);
      options.jobTimeoutMs = Number.isFinite(value) ? value : options.jobTimeoutMs;
      index += 1;
      continue;
    }
  }

  return options;
};

const loadEnvFile = (filePath) => {
  const absolutePath = path.resolve(process.cwd(), filePath);
  const values = {};

  if (existsSync(absolutePath) === false) {
    return values;
  }

  const lines = readFileSync(absolutePath, "utf8").split(/\r?\n/u);

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.length === 0 || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex < 0) {
      continue;
    }

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

  if (typeof processValue === "string" && processValue.length > 0) {
    return processValue;
  }

  const fileValue = envFileValues[name];

  if (typeof fileValue === "string" && fileValue.length > 0) {
    return fileValue;
  }

  return null;
};

const normaliseRedisHost = (rawHost) => {
  if (rawHost === null || rawHost.length === 0) {
    return "127.0.0.1";
  }

  if (rawHost === "redis" || rawHost === "stakload-redis") {
    return "127.0.0.1";
  }

  return rawHost;
};

const parseInteger = (value, fallback) => {
  if (typeof value === "number" && Number.isInteger(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);
    if (Number.isInteger(parsed)) {
      return parsed;
    }
  }

  return fallback;
};

const ensureDataDirectory = () => {
  mkdirSync(DATA_DIR, { recursive: true });
};

const createReport = (stage) => ({
  checks: [],
  completedAt: null,
  stage,
  startedAt: new Date().toISOString(),
  success: false,
});

const recordCheck = (report, check) => {
  report.checks.push({
    ...check,
    checkedAt: new Date().toISOString(),
  });
};

const assertCondition = (condition, message) => {
  if (condition === false) {
    throw new Error(message);
  }
};

const serialiseJson = (value) => `${JSON.stringify(value, null, 2)}\n`;

const writeJson = (filePath, value) => {
  ensureDataDirectory();
  writeFileSync(filePath, serialiseJson(value));
};

const fetchAccessToken = async (clientId, clientSecret) => {
  const url = new URL(TWITCH_OAUTH_TOKEN_URL);
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("client_secret", clientSecret);
  url.searchParams.set("grant_type", "client_credentials");

  const response = await fetch(url, { method: "POST" });
  const payload = await response.json();

  if (response.ok === false || typeof payload.access_token !== "string") {
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

  if (response.ok === false) {
    const errorBody = typeof parsedBody === "string" ? parsedBody : JSON.stringify(parsedBody, null, 2);
    throw new Error(`IGDB request failed for ${resource} (status ${response.status})\n${errorBody}`);
  }

  return Array.isArray(parsedBody) ? parsedBody : [];
};

const postWebhookPayload = async ({ apiBaseUrl, payload, resource, secret, action }) => {
  const response = await fetch(`${apiBaseUrl}/webhooks/${resource}/${action}`, {
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
      "x-secret": secret,
    },
    method: "POST",
  });

  const responseText = await response.text();

  return {
    status: response.status,
    text: responseText,
  };
};

const postWebhookWithInvalidSecret = async ({ apiBaseUrl, payload, resource, action }) => {
  const response = await fetch(`${apiBaseUrl}/webhooks/${resource}/${action}`, {
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
      "x-secret": "invalid-local-secret",
    },
    method: "POST",
  });

  return response.status;
};

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

const sortUniqueIntegerArray = (value) => {
  if (Array.isArray(value) === false) {
    return [];
  }

  return [...new Set(value.filter((entry) => Number.isInteger(entry)))].sort((a, b) => a - b);
};

const sameIntegerSet = (left, right) => {
  const leftSorted = sortUniqueIntegerArray(left);
  const rightSorted = sortUniqueIntegerArray(right);

  if (leftSorted.length !== rightSorted.length) {
    return false;
  }

  return leftSorted.every((value, index) => value === rightSorted[index]);
};

const nowUnixSeconds = () => Math.floor(Date.now() / 1000);

const wait = async (milliseconds) =>
  new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });

const waitFor = async (predicate, { description, timeoutMs, intervalMs }) => {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    const result = await predicate();

    if (result) {
      return result;
    }

    await wait(intervalMs);
  }

  throw new Error(`Timed out waiting for ${description} after ${timeoutMs}ms`);
};

const createDatabaseClient = async (databaseUrl) => {
  let Client;

  try {
    ({ Client } = workerBuilderRequire("pg"));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to load pg dependency from workspace: ${message}`);
  }

  const client = new Client({
    connectionString: databaseUrl,
  });
  await client.connect();
  return client;
};

const createQueueContext = async ({ redisHost, redisPassword, redisPort }) => {
  let Queue;
  let QueueEvents;

  try {
    ({ Queue, QueueEvents } = workerBuilderRequire("bullmq"));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Failed to load bullmq dependency from workspace: ${message}. Run "pnpm install" at repo root and retry.`,
    );
  }

  const connection = {
    host: redisHost,
    password: redisPassword,
    port: redisPort,
  };
  const queue = new Queue(GAME_BUILD_QUEUE_NAME, { connection });
  const queueEvents = new QueueEvents(GAME_BUILD_QUEUE_NAME, { connection });
  await queueEvents.waitUntilReady();
  const redisClient = await queue.client;

  return {
    async close() {
      await queueEvents.close();
      await queue.close();
    },
    queue,
    queueEvents,
    redisClient,
  };
};

const buildConfig = (options) => {
  const envFileValues = loadEnvFile(options.envFile);

  const apiWebhookPort = resolveEnvVariable("API_WEBHOOK_PORT", envFileValues) ?? "3001";
  const defaultApiBaseUrl =
    resolveEnvVariable("PUBLIC_WEBHOOK_BASE_URL", envFileValues) ?? `http://localhost:${apiWebhookPort}`;

  const redisHost = normaliseRedisHost(resolveEnvVariable("REDIS_HOST", envFileValues));
  const redisPort = parseInteger(resolveEnvVariable("REDIS_PORT", envFileValues), 6379);
  const redisPassword = resolveEnvVariable("REDIS_PASSWORD", envFileValues) ?? "stakload";
  const databaseUrl = resolveEnvVariable("DATABASE_URL", envFileValues);
  const igdbClientId = resolveEnvVariable("IGDB_CLIENT_ID", envFileValues);
  const igdbClientSecret = resolveEnvVariable("IGDB_CLIENT_SECRET", envFileValues);
  const webhookSecret = resolveEnvVariable("IGDB_WEBHOOK_SECRET", envFileValues);

  return {
    apiBaseUrl: options.apiBaseUrl ?? defaultApiBaseUrl,
    databaseUrl: options.databaseUrl ?? databaseUrl,
    genrePageSize: Math.max(1, options.genrePageSize),
    igdbClientId,
    igdbClientSecret,
    jobTimeoutMs: Math.max(1_000, options.jobTimeoutMs),
    postConcurrency: Math.max(1, options.postConcurrency),
    redisHost: options.redisHost ?? redisHost,
    redisPassword: options.redisPassword ?? redisPassword,
    redisPort: options.redisPort ?? redisPort,
    stage: options.stage,
    webhookSecret,
  };
};

const runPreflight = async (config, report) => {
  assertCondition(typeof config.databaseUrl === "string" && config.databaseUrl.length > 0, "Missing DATABASE_URL");
  assertCondition(
    typeof config.igdbClientId === "string" && config.igdbClientId.length > 0,
    "Missing IGDB_CLIENT_ID",
  );
  assertCondition(
    typeof config.igdbClientSecret === "string" && config.igdbClientSecret.length > 0,
    "Missing IGDB_CLIENT_SECRET",
  );
  assertCondition(
    typeof config.webhookSecret === "string" && config.webhookSecret.length > 0,
    "Missing IGDB_WEBHOOK_SECRET",
  );

  const accessToken = await fetchAccessToken(config.igdbClientId, config.igdbClientSecret);
  recordCheck(report, {
    details: "Fetched Twitch access token with configured IGDB credentials",
    name: "igdb_credentials",
    passed: true,
  });

  const databaseClient = await createDatabaseClient(config.databaseUrl);

  try {
    await databaseClient.query("SELECT 1");
  } finally {
    await databaseClient.end();
  }

  recordCheck(report, {
    details: "Connected to Postgres and executed SELECT 1",
    name: "postgres_connectivity",
    passed: true,
  });

  const queueContext = await createQueueContext(config);

  try {
    const redisPing = await queueContext.redisClient.ping();
    assertCondition(redisPing === "PONG", "Redis ping did not return PONG");
  } finally {
    await queueContext.close();
  }

  recordCheck(report, {
    details: "Connected to Redis through BullMQ queue connection",
    name: "redis_connectivity",
    passed: true,
  });

  const unauthorizedStatus = await postWebhookWithInvalidSecret({
    action: "create",
    apiBaseUrl: config.apiBaseUrl,
    payload: {
      id: 999_999_001,
      name: "Invalid Secret Probe",
    },
    resource: "genres",
  });

  assertCondition(unauthorizedStatus === 401, `Expected 401 for invalid secret check, got ${unauthorizedStatus}`);

  recordCheck(report, {
    details: `Received ${unauthorizedStatus} for invalid webhook secret probe`,
    name: "webhook_invalid_secret",
    passed: true,
  });

  return accessToken;
};

const fetchGenreDump = async (config, accessToken) => {
  const allGenres = [];
  let offset = 0;

  while (true) {
    const query = [
      "fields id,name,slug,url,checksum,updated_at;",
      "sort id asc;",
      `limit ${config.genrePageSize};`,
      `offset ${offset};`,
    ].join(" ");
    const page = await queryIgdb({
      accessToken,
      clientId: config.igdbClientId,
      query,
      resource: "genres",
    });
    const filteredPage = page.filter((entry) => Number.isInteger(entry.id));

    allGenres.push(...filteredPage);

    console.log(`Fetched genre page at offset ${offset} (${filteredPage.length} rows)`);

    if (filteredPage.length < config.genrePageSize) {
      break;
    }

    offset += config.genrePageSize;
  }

  const byId = new Map();

  for (const genre of allGenres) {
    byId.set(genre.id, genre);
  }

  const genres = [...byId.values()].sort((left, right) => left.id - right.id);
  writeJson(GENRE_DUMP_PATH, genres);

  return genres;
};

const ingestGenres = async (config, genres) => {
  let posted = 0;

  await runWithConcurrency(genres, config.postConcurrency, async (genre) => {
    const response = await postWebhookPayload({
      action: "create",
      apiBaseUrl: config.apiBaseUrl,
      payload: genre,
      resource: "genres",
      secret: config.webhookSecret,
    });

    if (response.status !== 204) {
      throw new Error(`Genre ingest failed for id ${genre.id} with status ${response.status}: ${response.text}`);
    }

    posted += 1;

    if (posted % 100 === 0 || posted === genres.length) {
      console.log(`Ingested ${posted}/${genres.length} genres`);
    }
  });
};

const fetchGenresCount = async (databaseClient) => {
  const queryResult = await databaseClient.query('SELECT COUNT(*)::int AS count FROM "genres"');
  const count = queryResult.rows.at(0)?.count;

  return typeof count === "number" ? count : Number.parseInt(String(count), 10);
};

const fetchCandidateGame = async (config, accessToken) => {
  const query = [
    "fields id,name,summary,rating,first_release_date,genres,platforms,themes,cover,updated_at;",
    "where genres != null & updated_at != null;",
    "sort updated_at desc;",
    "limit 1;",
  ].join(" ");
  const games = await queryIgdb({
    accessToken,
    clientId: config.igdbClientId,
    query,
    resource: "games",
  });

  const game = games.at(0);
  assertCondition(game != null, "Failed to fetch a candidate game from IGDB");
  assertCondition(Array.isArray(game.genres) && game.genres.length > 0, "Fetched game does not include genres");
  assertCondition(Number.isInteger(game.id), "Fetched game is missing integer id");

  return game;
};

const fetchGameRow = async (databaseClient, gameId) => {
  const queryResult = await databaseClient.query(
    [
      'SELECT "igdbId", "summary", "rating", "genres",',
      'FLOOR(EXTRACT(EPOCH FROM "sourceUpdatedAt"))::bigint AS "sourceUpdatedAtEpoch"',
      'FROM "games"',
      'WHERE "igdbId" = $1',
      "LIMIT 1",
    ].join(" "),
    [gameId],
  );

  return queryResult.rows.at(0) ?? null;
};

const verifyGameRow = ({ expectedGamePayload, gameRow, expectUpdatedSummary }) => {
  assertCondition(gameRow !== null, `Game ${expectedGamePayload.id} was not found in Postgres`);
  assertCondition(gameRow.igdbId === expectedGamePayload.id, "Postgres igdbId does not match expected game id");

  const expectedGenres = sortUniqueIntegerArray(expectedGamePayload.genres);
  const persistedGenres = sortUniqueIntegerArray(gameRow.genres);
  assertCondition(
    sameIntegerSet(expectedGenres, persistedGenres),
    `Postgres genres mismatch. Expected [${expectedGenres.join(", ")}], got [${persistedGenres.join(", ")}]`,
  );

  if (expectUpdatedSummary) {
    assertCondition(gameRow.summary === expectedGamePayload.summary, "Postgres summary did not update to expected value");
  }
};

const verifyCachedGamePayload = ({ cachedGame, expectedGamePayload }) => {
  assertCondition(cachedGame.id === expectedGamePayload.id, "Cached game id does not match expected game id");
  assertCondition(Array.isArray(cachedGame.genres), "Cached game genres is not an array");

  const expectedGenres = sortUniqueIntegerArray(expectedGamePayload.genres);

  for (const genreId of expectedGenres) {
    const matchedGenre = cachedGame.genres.find((genre) => genre.id === genreId);
    assertCondition(matchedGenre != null, `Cached game is missing genre id ${genreId}`);
    assertCondition(
      typeof matchedGenre.name === "string" && matchedGenre.name.length > 0,
      `Cached game genre ${genreId} is missing resolved name`,
    );
  }
};

const verifyWebhookTriggeredRedisUpdate = async ({ config, expectedGamePayload, report, stepName }) => {
  const queueContext = await createQueueContext(config);

  try {
    const cachedRaw = await waitFor(
      async () => queueContext.redisClient.get(`game:${expectedGamePayload.id}`),
      {
        description: `redis key game:${expectedGamePayload.id}`,
        intervalMs: 300,
        timeoutMs: config.jobTimeoutMs,
      },
    );
    const cachedGame = JSON.parse(cachedRaw);

    verifyCachedGamePayload({
      cachedGame,
      expectedGamePayload,
    });

    for (const genreId of sortUniqueIntegerArray(expectedGamePayload.genres)) {
      const member = await queueContext.redisClient.sismember(`genre:${genreId}:games`, String(expectedGamePayload.id));
      assertCondition(member === 1, `Redis set genre:${genreId}:games does not include game ${expectedGamePayload.id}`);
    }

    const inProgressMember = await queueContext.redisClient.sismember(
      GAME_BUILD_IN_PROGRESS_SET_KEY,
      String(expectedGamePayload.id),
    );
    assertCondition(
      inProgressMember === 0,
      `Redis in-progress set still contains game ${expectedGamePayload.id} after completion`,
    );

    recordCheck(report, {
      details: `Webhook-triggered queue processing updated Redis for game ${expectedGamePayload.id}`,
      name: stepName,
      passed: true,
    });
  } finally {
    await queueContext.close();
  }
};

const buildUpdatePayload = ({ createPayload, allGenres }) => {
  const usedGenreIds = new Set(sortUniqueIntegerArray(createPayload.genres));
  const extraGenreId = allGenres.map((genre) => genre.id).find((genreId) => usedGenreIds.has(genreId) === false) ?? null;

  const updatedGenres = extraGenreId === null ? sortUniqueIntegerArray(createPayload.genres) : [...usedGenreIds, extraGenreId];
  const updatedSummary = `${createPayload.summary ?? createPayload.name ?? "No summary"} [local webhook cache e2e update]`;
  const originalRating = typeof createPayload.rating === "number" ? createPayload.rating : 70;
  const updatedRating = Math.min(100, Number((originalRating + 0.01).toFixed(2)));
  const originalUpdatedAt =
    typeof createPayload.updated_at === "number" ? createPayload.updated_at : Math.max(1, nowUnixSeconds() - 120);
  const updatedAt = originalUpdatedAt + 120;

  return {
    ...createPayload,
    genres: updatedGenres,
    rating: updatedRating,
    summary: updatedSummary,
    updated_at: updatedAt,
  };
};

const runGenresStage = async ({ accessToken, config, databaseClient, report }) => {
  console.log("Fetching full IGDB genre dump");
  const genres = await fetchGenreDump(config, accessToken);
  assertCondition(genres.length > 0, "Genre dump returned no rows");

  recordCheck(report, {
    details: `Fetched ${genres.length} unique genres and wrote ${path.relative(process.cwd(), GENRE_DUMP_PATH)}`,
    name: "genres_dump",
    passed: true,
  });

  console.log("Posting genres to local webhook (first pass)");
  await ingestGenres(config, genres);
  const firstCount = await fetchGenresCount(databaseClient);
  assertCondition(firstCount === genres.length, `Postgres genre count mismatch after first ingest: ${firstCount}`);

  recordCheck(report, {
    details: `Postgres genres count is ${firstCount} after first ingest`,
    name: "genres_ingest_first_pass",
    passed: true,
  });

  console.log("Re-posting genres to verify idempotent behaviour");
  await ingestGenres(config, genres);
  const secondCount = await fetchGenresCount(databaseClient);
  assertCondition(secondCount === genres.length, `Postgres genre count mismatch after second ingest: ${secondCount}`);

  recordCheck(report, {
    details: `Postgres genres count stayed at ${secondCount} after second ingest`,
    name: "genres_ingest_idempotent",
    passed: true,
  });

  return genres;
};

const runCreateStage = async ({ accessToken, config, databaseClient, report }) => {
  const createPayload = await fetchCandidateGame(config, accessToken);
  writeJson(GAME_CREATE_PAYLOAD_PATH, createPayload);

  console.log(`Posting games/create for game ${createPayload.id}`);
  const createResponse = await postWebhookPayload({
    action: "create",
    apiBaseUrl: config.apiBaseUrl,
    payload: createPayload,
    resource: "games",
    secret: config.webhookSecret,
  });
  assertCondition(
    createResponse.status === 204,
    `games/create returned ${createResponse.status}: ${createResponse.text || "(empty body)"}`,
  );

  const gameRow = await fetchGameRow(databaseClient, createPayload.id);
  verifyGameRow({
    expectedGamePayload: createPayload,
    expectUpdatedSummary: false,
    gameRow,
  });

  recordCheck(report, {
    details: `games/create persisted game ${createPayload.id} with expected genres`,
    name: "game_create_postgres",
    passed: true,
  });

  return createPayload;
};

const runUpdateStage = async ({ allGenres, config, createPayload, databaseClient, report }) => {
  const updatePayload = buildUpdatePayload({
    allGenres,
    createPayload,
  });
  writeJson(GAME_UPDATE_PAYLOAD_PATH, updatePayload);

  console.log(`Posting games/update for game ${updatePayload.id}`);
  const updateResponse = await postWebhookPayload({
    action: "update",
    apiBaseUrl: config.apiBaseUrl,
    payload: updatePayload,
    resource: "games",
    secret: config.webhookSecret,
  });
  assertCondition(
    updateResponse.status === 204,
    `games/update returned ${updateResponse.status}: ${updateResponse.text || "(empty body)"}`,
  );

  const updatedRow = await fetchGameRow(databaseClient, updatePayload.id);
  verifyGameRow({
    expectedGamePayload: updatePayload,
    expectUpdatedSummary: true,
    gameRow: updatedRow,
  });

  recordCheck(report, {
    details: `games/update persisted updated payload for game ${updatePayload.id}`,
    name: "game_update_postgres",
    passed: true,
  });

  return updatePayload;
};

const main = async () => {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    printHelp();
    return;
  }

  if (STAGES.has(options.stage) === false) {
    throw new Error(`Unknown --stage value: ${options.stage}`);
  }

  const config = buildConfig(options);
  const report = createReport(config.stage);
  let databaseClient = null;

  try {
    console.log(`Running webhook cache E2E stage: ${config.stage}`);

    const accessToken = await runPreflight(config, report);

    if (config.stage === "preflight") {
      report.success = true;
      return;
    }

    databaseClient = await createDatabaseClient(config.databaseUrl);
    const allGenres = await runGenresStage({
      accessToken,
      config,
      databaseClient,
      report,
    });

    if (config.stage === "genres") {
      report.success = true;
      return;
    }

    const createPayload = await runCreateStage({
      accessToken,
      config,
      databaseClient,
      report,
    });

    if (config.stage === "create") {
      report.success = true;
      return;
    }

    await verifyWebhookTriggeredRedisUpdate({
      config,
      expectedGamePayload: createPayload,
      report,
      stepName: "webhook_create_redis",
    });

    const updatePayload = await runUpdateStage({
      allGenres,
      config,
      createPayload,
      databaseClient,
      report,
    });

    await verifyWebhookTriggeredRedisUpdate({
      config,
      expectedGamePayload: updatePayload,
      report,
      stepName: "webhook_update_redis",
    });

    report.success = true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    recordCheck(report, {
      details: message,
      name: "fatal_error",
      passed: false,
    });
    throw error;
  } finally {
    if (databaseClient) {
      await databaseClient.end().catch(() => {});
    }

    report.completedAt = new Date().toISOString();
    writeJson(REPORT_PATH, report);
    console.log(`Wrote report: ${path.relative(process.cwd(), REPORT_PATH)}`);
  }
};

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
});
