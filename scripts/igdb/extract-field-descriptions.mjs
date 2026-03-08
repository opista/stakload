import fs from "node:fs";
import https from "node:https";
import path from "node:path";

const DOCS_URL = "https://api-docs.igdb.com/#endpoints";
const OUT_DIR = path.resolve("scripts/igdb/data");
const HTML_PATH = path.join(OUT_DIR, "igdb-endpoints.html");
const MAP_PATH = path.join(OUT_DIR, "field-descriptions.json");
const RESOURCE_MAP_PATH = path.join(OUT_DIR, "resource-descriptions.json");
const META_PATH = path.join(OUT_DIR, "extract-metadata.json");

const decodeEntities = (input) =>
  input
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(Number.parseInt(code, 16)));

const decodeHtml = (input) =>
  decodeEntities(input.replace(/<[^>]+>/g, ""))
    .replace(/\s+/g, " ")
    .trim();

const normaliseViewSourceHtml = (html) => {
  if (!html.includes('id="viewsource"')) {
    return html;
  }

  const lines = [];
  const lineChunks = html.split(/<span id="line\d+">/).slice(1);
  for (const chunk of lineChunks) {
    const lineChunk = chunk.replace(/<\/span><\/span>\s*$/i, "");
    const line = decodeEntities(lineChunk.replace(/<[^>]+>/g, ""));
    if (line.length > 0) {
      lines.push(line);
    }
  }

  if (lines.length === 0) {
    return html;
  }

  return lines.join("\n");
};

const fetchHtml = (url) =>
  new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
        if (!res.statusCode || res.statusCode >= 400) {
          reject(new Error(`Request failed with status ${res.statusCode ?? "unknown"}`));
          return;
        }
        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
      })
      .on("error", reject);
  });

const parseTables = (html) => {
  const resourceToFields = {};
  const resourceDescriptions = {};
  const sectionRegex = /<h2([^>]*)>([\s\S]*?)<\/h2>([\s\S]*?)(?=<h2[^>]*>|$)/gi;

  const h2IdToResource = {
    "age-rating-category": "age_rating_categories",
    "age-rating-content-description-v2": "age_rating_content_descriptions_v2",
    "age-rating-content-description": "age_rating_content_descriptions",
    "age-rating-organization": "age_rating_organizations",
    "age-rating": "age_ratings",
    "alternative-name": "alternative_names",
    "artwork-type": "artwork_types",
    "company-logo": "company_logos",
    "company-status": "company_statuses",
    "date-format": "date_formats",
    "external-game-source": "external_game_sources",
    "external-game": "external_games",
    "game-engine-logo": "game_engine_logos",
    "game-engine": "game_engines",
    "game-mode": "game_modes",
    "game-time-to-beat": "game_time_to_beats",
    "game-video": "game_videos",
    "involved-company": "involved_companies",
    "language-support-type": "language_support_types",
    "language-support": "language_supports",
    "multiplayer-mode": "multiplayer_modes",
    "platform-family": "platform_families",
    "platform-logo": "platform_logos",
    "platform-type": "platform_types",
    "player-perspective": "player_perspectives",
    "release-date-region": "release_date_regions",
    "release-date-status": "release_date_statuses",
    "website-type": "website_types",
    artwork: "artworks",
    collection: "collections",
    company: "companies",
    cover: "covers",
    franchise: "franchises",
    game: "games",
    genre: "genres",
    keyword: "keywords",
    language: "languages",
    platform: "platforms",
    screenshot: "screenshots",
    theme: "themes",
    website: "websites",
  };

  const slugToResource = (slug) => {
    if (!slug) {
      return null;
    }
    if (h2IdToResource[slug]) {
      return h2IdToResource[slug];
    }

    const snake = slug.replace(/-/g, "_");
    if (snake.endsWith("y")) {
      return `${snake.slice(0, -1)}ies`;
    }
    if (/(s|x|z|ch|sh)$/i.test(snake)) {
      return `${snake}es`;
    }
    return `${snake}s`;
  };

  for (const sectionMatch of html.matchAll(sectionRegex)) {
    const headingAttrs = sectionMatch[1] ?? "";
    const headingText = decodeHtml(sectionMatch[2] ?? "");
    const afterHeading = sectionMatch[3];
    const headingIdMatch = headingAttrs.match(/\sid="([^"]+)"/i);
    const headingId = headingIdMatch?.[1] ?? null;
    const requestPathMatch = afterHeading.match(/https:\/\/api\.igdb\.com\/v4\/([a-z0-9_]+)/i);
    const resource = requestPathMatch?.[1] ?? slugToResource(headingId);
    if (!resource) {
      continue;
    }

    const tableMatch = afterHeading.match(
      /<table[^>]*>\s*<thead>[\s\S]*?<th>\s*field\s*<\/th>[\s\S]*?<th>\s*type\s*<\/th>[\s\S]*?<th>\s*description\s*<\/th>[\s\S]*?<\/thead>\s*<tbody>([\s\S]*?)<\/tbody>\s*<\/table>/i,
    );
    if (!tableMatch) {
      continue;
    }

    const beforeRequestPath = afterHeading.split(/<h3[^>]*>\s*Request Path\s*<\/h3>/i)[0] ?? afterHeading;
    const cleanedIntro = beforeRequestPath
      .replace(/<div[^>]*class="highlight"[\s\S]*?<\/div>/gi, "")
      .replace(/<aside[\s\S]*?<\/aside>/gi, "");
    const paragraphMatches = Array.from(cleanedIntro.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi));
    const firstParagraph = paragraphMatches
      .map((match) => decodeHtml(match[1]))
      .find(
        (value) =>
          value.length > 0 && !value.includes("https://api.igdb.com/v4/") && value.toLowerCase() !== "request path",
      );
    resourceDescriptions[resource] = firstParagraph || headingText;
    const body = tableMatch[1];
    const fields = {};
    const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    const cellRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;

    for (const rowMatch of body.matchAll(rowRegex)) {
      const rowHtml = rowMatch[1];
      const cells = Array.from(rowHtml.matchAll(cellRegex), (match) => decodeHtml(match[1]));
      if (cells.length < 3) {
        continue;
      }

      const field = cells[0];
      const description = cells[2];
      if (!field || !description) {
        continue;
      }
      fields[field] = description;
    }

    if (Object.keys(fields).length > 0) {
      resourceToFields[resource] = fields;
    }
  }

  return { resourceToFields, resourceDescriptions };
};

const getArgValue = (flag) => {
  const index = process.argv.findIndex((arg) => arg === flag);
  if (index < 0) {
    return null;
  }
  return process.argv[index + 1] ?? null;
};

fs.mkdirSync(OUT_DIR, { recursive: true });

const inputHtmlPath = getArgValue("--input-html");
let html;
let sourceUrl = inputHtmlPath ? `file://${path.resolve(inputHtmlPath)}` : null;

if (inputHtmlPath) {
  html = fs.readFileSync(path.resolve(inputHtmlPath), "utf8");
} else {
  try {
    html = await fetchHtml(DOCS_URL);
    sourceUrl = DOCS_URL;
  } catch (error) {
    throw new Error(
      [
        `Failed to fetch docs from ${DOCS_URL}.`,
        "Re-run with a local page dump from your browser:",
        "node scripts/igdb/extract-field-descriptions.mjs --input-html scripts/igdb/data/igdb-endpoints.html",
      ].join("\n"),
      { cause: error },
    );
  }
}

html = normaliseViewSourceHtml(html);
fs.writeFileSync(HTML_PATH, html);
const { resourceToFields, resourceDescriptions } = parseTables(html);
fs.writeFileSync(MAP_PATH, `${JSON.stringify(resourceToFields, null, 2)}\n`);
fs.writeFileSync(RESOURCE_MAP_PATH, `${JSON.stringify(resourceDescriptions, null, 2)}\n`);
fs.writeFileSync(
  META_PATH,
  `${JSON.stringify(
    {
      sourceUrl,
      fetchedAt: new Date().toISOString(),
      resources: Object.keys(resourceToFields).length,
    },
    null,
    2,
  )}\n`,
);

console.log(
  `Extracted ${Object.keys(resourceToFields).length} endpoint tables to ${path.relative(process.cwd(), MAP_PATH)}`,
);
console.log(
  `Extracted ${Object.keys(resourceDescriptions).length} resource descriptions to ${path.relative(process.cwd(), RESOURCE_MAP_PATH)}`,
);
console.log(`Saved raw HTML to ${path.relative(process.cwd(), HTML_PATH)} (source: ${sourceUrl})`);
