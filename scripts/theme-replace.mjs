import fs from "fs";
import path from "path";

const root = path.join(process.cwd(), "src");

// Light theme class mappings — do NOT convert to dark mode
const replacements = [
  [/bg-white/g, "bg-surface-elevated"],
  [/bg-slate-50/g, "bg-surface"],
  [/hover:bg-slate-50/g, "hover:bg-surface"],
  [/hover:bg-slate-100/g, "hover:bg-surface-elevated"],
  [/text-slate-700/g, "text-slate-700"], // no-op guard
];

function walk(dir) {
  for (const file of fs.readdirSync(dir)) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) walk(full);
    else if (/\.tsx?$/.test(file)) {
      let content = fs.readFileSync(full, "utf8");
      const original = content;
      for (const [from, to] of replacements) content = content.replace(from, to);
      if (content !== original) fs.writeFileSync(full, content);
    }
  }
}

// Disabled — site uses light theme via CSS variables in globals.css
console.log("Theme replace skipped (light theme active)");
