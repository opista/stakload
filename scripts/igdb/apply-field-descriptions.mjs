import fs from "node:fs";
import path from "node:path";

const DATA_DIR = path.resolve("scripts/igdb/data");
const MAP_PATH = path.join(DATA_DIR, "field-descriptions.json");
const RESOURCE_MAP_PATH = path.join(DATA_DIR, "resource-descriptions.json");
const ENTITIES_DIR = path.resolve("packages/database/src/entities");

const fieldMap = JSON.parse(fs.readFileSync(MAP_PATH, "utf8"));
const resourceDescriptionMap = JSON.parse(fs.readFileSync(RESOURCE_MAP_PATH, "utf8"));

const explicitFieldMap = {
  ageRatings: "age_ratings",
  alternativeNames: "alternative_names",
  artworks: "artworks",
  artworkType: "artwork_type",
  bundles: "bundles",
  changeDateFormat: "change_date_format",
  changedCompany: "changed_company_id",
  cover: "cover",
  developed: "developed",
  externalGames: "external_games",
  externalGameSource: "external_game_source",
  franchise: "franchise",
  gameEngines: "game_engines",
  gameId: "game_id",
  gameMode: "game_mode",
  gameReleaseFormat: "game_release_format",
  gameStatus: "game_status",
  gameType: "type",
  languageSupports: "language_supports",
  logo: "logo",
  multiplayerModes: "multiplayer_modes",
  nativeName: "native_name",
  organization: "organization",
  parent: "parent",
  parentGame: "parent_game",
  platformFamily: "platform_family",
  platformLogo: "platform_logo",
  platformType: "platform_type",
  published: "published",
  ratingCategory: "rating_category",
  ratingContentDescriptions: "rating_content_descriptions",
  ratingCoverUrl: "rating_cover_url",
  similarGames: "similar_games",
  startDateFormat: "start_date_format",
  status: "status",
  trusted: "trusted",
  type: "type",
  versionParent: "version_parent",
  videoId: "video_id",
  videos: "videos",
};

const resourceSchemaAliases = {
  game_engine_logos: "gameenginelogos",
};

const manualDescriptionOverrides = {
  "collection.entity.ts:description": "Description of the collection",
  "company.entity.ts:changeDateFormat": "The format of the change date",
  "company.entity.ts:startDateFormat": "The format of the start date",
  "company.entity.ts:status": "The status of the company",
  "age-rating.entity.ts:organization": "The organisation that issued this rating",
  "age-rating.entity.ts:ratingCategory": "The category of this rating",
  "age-rating.entity.ts:ratingContentDescriptions": "Content descriptors attached to this rating",
  "age-rating-category.entity.ts:organization": "The organization this rating category is associated with",
  "age-rating-content-description-v2.entity.ts:description": "A string containing the age rating content descriptions",
  "age-rating-content-description-v2.entity.ts:organization": "The organization this content description belongs to",
  "age-rating-category.entity.ts:rating": "The rating string used by this rating category",
  "age-rating.entity.ts:checksum": "Hash of the object",
  "alternative-name.entity.ts:name": "Alternative title for this game",
  "alternative-name.entity.ts:game": "The game this alternative name is associated with",
  "artwork.entity.ts:artworkType": "The type of artwork",
  "artwork.entity.ts:game": "The game this artwork is associated with",
  "company.entity.ts:changedCompany": "The new ID for a company that has gone through a merger or restructuring",
  "company.entity.ts:logo": "The company’s logo",
  "company.entity.ts:parent": "A company with a controlling interest in a specific company",
  "cover.entity.ts:game":
    "The game this cover is associated with. If it is empty then this cover belongs to a game_localization, which can be found under game_localization field",
  "date-format.entity.ts:format": "The date format in plain text",
  "external-game.entity.ts:checksum": "Hash of the object",
  "external-game.entity.ts:externalGameSource": "The id of the other service",
  "external-game.entity.ts:game": "The IGDB ID of the game",
  "external-game.entity.ts:gameReleaseFormat": "The media of the external game.",
  "external-game.entity.ts:platform": "The platform of the external game product.",
  "external-game.entity.ts:uid": "The other services ID for this game",
  "game-engine.entity.ts:logo": "Logo of the game engine",
  "game-release-format.entity.ts:format": "The release format name",
  "game-status.entity.ts:status": "The status label",
  "game-type.entity.ts:type": "The game type label",
  "game-video.entity.ts:game": "The game this video is associated with",
  "game-video.entity.ts:name": "The name of the video",
  "game.entity.ts:checksum": "Hash of the object",
  "game.entity.ts:cover": "The cover of this game",
  "game.entity.ts:franchise": "The main franchise",
  "game.entity.ts:gameStatus": "The status of the games release",
  "game.entity.ts:gameType": "The category of this game",
  "game.entity.ts:name": "Name of the game",
  "game.entity.ts:parentGame": "If a DLC, expansion or part of a bundle, this is the main game or bundle",
  "game.entity.ts:storyline": "A short description of a games story",
  "game.entity.ts:versionParent": "If a version, this is the main game",
  "game.entity.ts:versionTitle": "Title of this version (i.e Gold edition)",
  "involved-company.entity.ts:company": "The company involved with the game",
  "involved-company.entity.ts:developer": "Indicates if the company is a developer",
  "involved-company.entity.ts:game": "The game this company is involved in",
  "involved-company.entity.ts:porting": "Indicates if the company did porting work",
  "involved-company.entity.ts:publisher": "Indicates if the company is a publisher",
  "involved-company.entity.ts:supporting": "Indicates if the company is in a supporting role",
  "language-support.entity.ts:game": "The game this language support entry is associated with",
  "language-support.entity.ts:language": "The language supported by the game",
  "language-support.entity.ts:languageSupportType": "The type of language support",
  "multiplayer-mode.entity.ts:lanCoop": "True if the game supports LAN coop",
  "multiplayer-mode.entity.ts:splitScreen": "True if the game supports split screen, offline multiplayer",
  "multiplayer-mode.entity.ts:game": "The game this multiplayer mode is associated with",
  "multiplayer-mode.entity.ts:platform": "The platform this multiplayer mode refers to",
  "platform.entity.ts:platformFamily": "The family of platforms this one belongs to",
  "platform.entity.ts:platformLogo": "The logo of this platform",
  "platform.entity.ts:platformType": "The type of the platform",
  "release-date-region.entity.ts:region": "The release date region name",
  "screenshot.entity.ts:game": "The game this screenshot is associated with",
  "website.entity.ts:checksum": "Hash of the object",
  "website.entity.ts:game": "The game this website is associated with",
  "website.entity.ts:trusted": "If this website is considered trusted",
  "website.entity.ts:type": "The service this website links to",
};

const toSnake = (value) => value.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();

const mapPropertyToField = (propertyName) => {
  if (explicitFieldMap[propertyName]) {
    return explicitFieldMap[propertyName];
  }

  if (propertyName.endsWith("Ids")) {
    const stem = toSnake(propertyName.slice(0, -3));
    return stem.endsWith("y") ? `${stem.slice(0, -1)}ies` : `${stem}s`;
  }
  if (propertyName.endsWith("Id")) {
    return toSnake(propertyName.slice(0, -2));
  }
  return toSnake(propertyName);
};

const stripInlineFieldComments = (lines) => {
  const out = [];
  for (let index = 0; index < lines.length; index += 1) {
    const current = lines[index];
    const next = lines[index + 1] ?? "";
    const isComment = /^\s*\/\*\* .* \*\/\s*$/.test(current);
    const nextIsField = /^\s+[A-Za-z0-9_]+(\?|!)?:\s*[^;]+;\s*$/.test(next);
    if (isComment && nextIsField) {
      continue;
    }
    out.push(current);
  }
  return out;
};

const files = fs.readdirSync(ENTITIES_DIR).filter((file) => file.endsWith(".entity.ts") && file !== "index.ts");

let applied = 0;
let unmatched = 0;
const unmatchedRecords = [];

for (const file of files) {
  const fullPath = path.join(ENTITIES_DIR, file);
  const source = fs.readFileSync(fullPath, "utf8");

  const entityMatch = source.match(/@Entity\((?:\{\s*name:\s*"([^"]+)"\s*\}|"([^"]+)")\)/);
  const entityName = entityMatch?.[1] ?? entityMatch?.[2] ?? null;

  const resourceKey = entityName ? (resourceSchemaAliases[entityName] ?? entityName) : null;
  const descriptions = resourceKey ? (fieldMap[resourceKey] ?? null) : null;

  let withEntityDescription = source;
  if (resourceKey && resourceDescriptionMap[resourceKey]) {
    const description = resourceDescriptionMap[resourceKey];
    const entityDocRegex = /\/\*\*[\s\S]*?\*\/\s*\n@Entity\(/m;
    if (entityDocRegex.test(withEntityDescription)) {
      withEntityDescription = withEntityDescription.replace(entityDocRegex, `/**\n * ${description}.\n */\n@Entity(`);
    } else {
      withEntityDescription = withEntityDescription.replace(/@Entity\(/, `/**\n * ${description}.\n */\n@Entity(`);
    }
  }

  const lines = stripInlineFieldComments(withEntityDescription.split(/\r?\n/));
  const output = [];

  for (const line of lines) {
    const fieldMatch = line.match(/^(\s+)([A-Za-z0-9_]+)(\?|!)?:\s*[^;]+;\s*$/);
    if (!fieldMatch) {
      output.push(line);
      continue;
    }

    const indent = fieldMatch[1];
    const propertyName = fieldMatch[2];

    if (descriptions) {
      const igdbField = mapPropertyToField(propertyName);
      const compactField = igdbField.replaceAll("_", "");
      const description = descriptions[igdbField] ?? descriptions[compactField];
      if (description) {
        output.push(`${indent}/** ${description} */`);
        applied += 1;
      } else {
        const overrideKey = `${file}:${propertyName}`;
        const manualDescription = manualDescriptionOverrides[overrideKey];
        if (manualDescription) {
          output.push(`${indent}/** ${manualDescription} */`);
          applied += 1;
        } else {
          unmatched += 1;
          unmatchedRecords.push({
            file,
            propertyName,
            igdbField,
            resource: resourceKey,
          });
        }
      }
    } else {
      const overrideKey = `${file}:${propertyName}`;
      const manualDescription = manualDescriptionOverrides[overrideKey];
      if (manualDescription) {
        output.push(`${indent}/** ${manualDescription} */`);
        applied += 1;
      }
    }

    output.push(line);
  }

  fs.writeFileSync(fullPath, `${output.join("\n")}\n`);
}

const unmatchedPath = path.join(DATA_DIR, "unmatched-fields.json");
fs.writeFileSync(unmatchedPath, `${JSON.stringify(unmatchedRecords, null, 2)}\n`);

console.log(`Applied ${applied} verbatim field descriptions.`);
console.log(`Unmatched fields: ${unmatched}.`);
console.log(`Unmatched details: ${path.relative(process.cwd(), unmatchedPath)}`);
