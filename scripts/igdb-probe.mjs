#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const IGDB_BASE_URL = "https://api.igdb.com/v4";
const TWITCH_OAUTH_TOKEN_URL = "https://id.twitch.tv/oauth2/token";

function printHelp() {
  console.log(`IGDB probe

Usage:
  pnpm igdb:probe <resource> [options]

Examples:
  pnpm igdb:probe games --query "fields name,slug,first_release_date; search \\"halo\\"; limit 5;"
  pnpm igdb:probe platforms --fields "name,slug" --limit 10
  pnpm igdb:probe genres --fields "name" --sort "name asc" --limit 50
  pnpm igdb:probe games --fields "name,rating" --where "rating != null & rating > 80" --limit 20

Options:
  -r, --resource <name>  IGDB resource (e.g. games, platforms, genres)
  -q, --query <apicalypse>  Raw IGDB query body
  -f, --fields <list>  Comma-separated fields (default: *)
  -w, --where <expr>  IGDB where clause (without trailing semicolon)
  -s, --sort <expr>  IGDB sort clause (without trailing semicolon)
  -l, --limit <number>  IGDB limit (default: 5)
  --env-file <path>  Env file path (default: .env)
  -h, --help  Show help

Environment:
  IGDB_CLIENT_ID and IGDB_CLIENT_SECRET are required.
`);
}

function parseArgs(argv) {
  const options = {
    envFile: ".env",
    fields: "*",
    help: false,
    limit: 5,
    query: null,
    resource: null,
    sort: null,
    where: null,
  };

  const positional = [];

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "-h" || arg === "--help") {
      options.help = true;
      continue;
    }

    if (arg === "-r" || arg === "--resource") {
      options.resource = argv[index + 1] ?? null;
      index += 1;
      continue;
    }

    if (arg === "-q" || arg === "--query") {
      options.query = argv[index + 1] ?? null;
      index += 1;
      continue;
    }

    if (arg === "-f" || arg === "--fields") {
      options.fields = argv[index + 1] ?? "*";
      index += 1;
      continue;
    }

    if (arg === "-w" || arg === "--where") {
      options.where = argv[index + 1] ?? null;
      index += 1;
      continue;
    }

    if (arg === "-s" || arg === "--sort") {
      options.sort = argv[index + 1] ?? null;
      index += 1;
      continue;
    }

    if (arg === "-l" || arg === "--limit") {
      const rawLimit = argv[index + 1];
      const parsedLimit = Number.parseInt(rawLimit ?? "", 10);
      options.limit = Number.isFinite(parsedLimit) ? parsedLimit : options.limit;
      index += 1;
      continue;
    }

    if (arg === "--env-file") {
      options.envFile = argv[index + 1] ?? ".env";
      index += 1;
      continue;
    }

    positional.push(arg);
  }

  if (options.resource === null && positional.length > 0) {
    options.resource = positional[0];
  }

  return options;
}

function loadEnvFile(filePath) {
  const absolutePath = resolve(process.cwd(), filePath);
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

    if (
      (value.startsWith("\"") && value.endsWith("\"")) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    values[key] = value;
  }

  return values;
}

function resolveEnvVariable(name, envFileValues) {
  const processValue = process.env[name];
  if (typeof processValue === "string" && processValue.length > 0) {
    return processValue;
  }

  const fileValue = envFileValues[name];
  if (typeof fileValue === "string" && fileValue.length > 0) {
    return fileValue;
  }

  return null;
}

function buildQuery(options) {
  if (typeof options.query === "string" && options.query.length > 0) {
    return options.query.trim();
  }

  const statements = [`fields ${options.fields};`];

  if (typeof options.where === "string" && options.where.length > 0) {
    statements.push(`where ${options.where};`);
  }

  if (typeof options.sort === "string" && options.sort.length > 0) {
    statements.push(`sort ${options.sort};`);
  }

  statements.push(`limit ${options.limit};`);
  return statements.join(" ");
}

async function fetchAccessToken(clientId, clientSecret) {
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
}

async function queryIgdb({ accessToken, clientId, query, resource }) {
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
    const errorBody =
      typeof parsedBody === "string" ? parsedBody : JSON.stringify(parsedBody, null, 2);
    throw new Error(`IGDB request failed (status ${response.status})\n${errorBody}`);
  }

  return parsedBody;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help || options.resource === null) {
    printHelp();
    process.exit(options.help ? 0 : 1);
  }

  const envFileValues = loadEnvFile(options.envFile);
  const clientId = resolveEnvVariable("IGDB_CLIENT_ID", envFileValues);
  const clientSecret = resolveEnvVariable("IGDB_CLIENT_SECRET", envFileValues);

  if (clientId === null || clientSecret === null) {
    console.error(
      "Missing IGDB credentials. Set IGDB_CLIENT_ID and IGDB_CLIENT_SECRET in env or .env.",
    );
    process.exit(1);
  }

  const query = buildQuery(options);
  console.error(`Resource: ${options.resource}`);
  console.error(`Query: ${query}`);

  const accessToken = await fetchAccessToken(clientId, clientSecret);
  const responseBody = await queryIgdb({
    accessToken,
    clientId,
    query,
    resource: options.resource,
  });

  if (Array.isArray(responseBody)) {
    console.error(`Rows: ${responseBody.length}`);
  }

  console.log(JSON.stringify(responseBody, null, 2));
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
});