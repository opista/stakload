import fs from "node:fs";
import path from "node:path";

const appPackagePath = process.argv[2];
if (!appPackagePath) {
  process.stderr.write("Usage: node scripts/tilt/discover-shared-packages.mjs <app-package-json>\n");
  process.exit(1);
}

const appPackageJson = JSON.parse(fs.readFileSync(appPackagePath, "utf8"));
const deps = {
  ...(appPackageJson.dependencies ?? {}),
  ...(appPackageJson.optionalDependencies ?? {}),
};

const sharedPackages = Object.entries(deps)
  .filter(([name, version]) => name.startsWith("@stakload/") && version === "workspace:*")
  .map(([name]) => name.slice("@stakload/".length))
  .filter((name) => fs.existsSync(path.join("packages", name, "package.json")))
  .sort();

process.stdout.write(sharedPackages.join("\n"));
