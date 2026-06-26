import fs from "fs";

const allTs = fs.readFileSync("src/lib/calculators/compute/all.ts", "utf8");
const defTs = fs.readFileSync("src/lib/calculators/definitions.ts", "utf8");
const exportMatch = allTs.match(/export const computeFunctions[^=]*=\s*\{([\s\S]*?)\n\};/);
const slugs = [...exportMatch[1].matchAll(/"([^"]+)"\s*:/g)].map((m) => m[1]);
const funcBlocks = {};
const funcRegex = /const (\w+):\s*ComputeFn\s*=\s*\(values\)\s*=>\s*\{([\s\S]*?)\n\};/g;
let m;
while ((m = funcRegex.exec(allTs))) funcBlocks[m[1]] = m[2];
const slugToFunc = {};
for (const line of exportMatch[1].split("\n")) {
  const sm = line.match(/"([^"]+)":\s*(\w+)/);
  if (sm) slugToFunc[sm[1]] = sm[2];
}
let issues = 0;
for (const slug of slugs) {
  const body = funcBlocks[slugToFunc[slug]];
  const vFields = [
    ...new Set(
      [...body.matchAll(/v\(values,\s*"([^"]+)"/g)].map((x) => x[1]).filter((id) => id !== "filingStatus"),
    ),
  ];
  const usesFiling = /filingStatus\(values\)/.test(body);
  const defBlock = defTs.match(
    new RegExp(`"${slug}": def\\("${slug}", \\[([\\s\\S]*?)\\], \\[([\\s\\S]*?)\\]\\)`),
  );
  if (!defBlock) {
    console.log("NO BLOCK", slug);
    issues++;
    continue;
  }
  const defFields = [...defBlock[1].matchAll(/id: "([^"]+)"/g)].map((x) => x[1]);
  const defResults = [...defBlock[2].matchAll(/id: "([^"]+)"/g)].map((x) => x[1]);
  const returnMatch = body.match(/return\s*\{([\s\S]*?)\n\s*\};/);
  const resultKeys = [];
  if (returnMatch)
    for (const line of returnMatch[1].split("\n")) {
      const colon = line.match(/^\s*(\w+)\s*:/);
      const shorthand = line.match(/^\s*(\w+)\s*,\s*$/);
      if (colon) resultKeys.push(colon[1]);
      else if (shorthand) resultKeys.push(shorthand[1]);
    }
  const missingFields = vFields.filter((f) => !defFields.includes(f));
  const extraFields = defFields.filter((f) => f !== "filingStatus" && !vFields.includes(f));
  const missingResults = resultKeys.filter((r) => !defResults.includes(r));
  const extraResults = defResults.filter((r) => !resultKeys.includes(r));
  if (
    missingFields.length ||
    extraFields.length ||
    missingResults.length ||
    extraResults.length ||
    (usesFiling && !defFields.includes("filingStatus"))
  ) {
    console.log(slug, { missingFields, extraFields, missingResults, extraResults, usesFiling });
    issues++;
  }
}
console.log("issues", issues, "slugs", slugs.length);
