import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(__dirname, "..");
const vendorDir = path.join(packageRoot, "vendor");
const outputPath = path.join(vendorDir, "igdbapi.proto");
const protoUrl = "https://api.igdb.com/v4/igdbapi.proto";

const response = await fetch(protoUrl);

if (!response.ok) {
  throw new Error(`Failed to download IGDB proto: ${response.status} ${response.statusText}`);
}

const proto = await response.text();

await mkdir(vendorDir, { recursive: true });
await writeFile(outputPath, proto);

console.log(`Updated ${outputPath} from ${protoUrl}`);
