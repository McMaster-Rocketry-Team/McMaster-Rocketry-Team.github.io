#!/usr/bin/env node
// Fails the build if the literal string "TODO" reaches the built HTML. This
// is the go-live gate, not a merge check on every push to dev: the site is
// expected to carry visible TODO badges until Robin fills in real content,
// per PLAN.md decision 2. Run this before flipping a production deploy live,
// not as a blocker on iterative work.

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const distDir = join(import.meta.dirname, '..', 'dist');

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (entry.endsWith('.html')) out.push(full);
  }
  return out;
}

let files;
try {
  files = walk(distDir);
} catch {
  console.error(`No dist/ directory at ${distDir}. Run "astro build" first.`);
  process.exit(1);
}

let hits = 0;
for (const file of files) {
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    let from = 0;
    let at;
    // Astro's minified output puts a whole page on very few lines, so a
    // single line can hold many independent TODO occurrences: report each
    // with its own surrounding context instead of the line's first 120
    // characters, which would show the same unrelated snippet every time.
    while ((at = line.indexOf('TODO', from)) !== -1) {
      hits++;
      const start = Math.max(0, at - 40);
      const context = line.slice(start, at + 60);
      console.log(`${file.replace(distDir, 'dist')}:${i + 1}: ...${context}...`);
      from = at + 4;
    }
  });
}

if (hits > 0) {
  console.error(`\n${hits} line(s) with "TODO" in the built output. Fill the content before shipping.`);
  process.exit(1);
}

console.log('No TODO strings in the built output.');
