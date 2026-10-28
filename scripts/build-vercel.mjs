import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const source = resolve(root, "api_service/app/api/static");
const output = resolve(root, "dist");
const apiUrl = (process.env.VERISIGHT_API_URL || "").trim().replace(/\/+$/, "");

await mkdir(output, { recursive: true });
await cp(source, output, { recursive: true });
await writeFile(
  resolve(output, "config.js"),
  `window.VERISIGHT_API_URL = ${JSON.stringify(apiUrl)};\n`,
);

for (const file of ["index.html", "stream.html"]) {
  const path = resolve(output, file);
  const html = await readFile(path, "utf8");
  await writeFile(path, html.replace("</head>", '  <script src="/config.js"></script>\n</head>'));
}

console.log(`Built VeriSight static site in ${output}`);
