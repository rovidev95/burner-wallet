#!/usr/bin/env node
/**
 * Verifies package.json dependencies use exact versions (no ^ or ~).
 * Used in CI per bounty #205.
 */
const fs = require('fs');
const path = require('path');

const pkgPath = path.join(__dirname, '..', 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

const sections = ['dependencies', 'devDependencies', 'optionalDependencies'];
const unpinned = [];

for (const section of sections) {
  if (!pkg[section]) continue;
  for (const [name, version] of Object.entries(pkg[section])) {
    if (typeof version !== 'string') continue;
    if (version.startsWith('^') || version.startsWith('~')) {
      unpinned.push({ section, name, version });
    }
  }
}

if (unpinned.length > 0) {
  console.error('Unpinned dependencies found (use exact versions, no ^ or ~):');
  unpinned.forEach(({ section, name, version }) => {
    console.error(`  ${section}.${name}: ${version}`);
  });
  console.error(`\nTotal: ${unpinned.length} unpinned package(s).`);
  process.exit(1);
}

console.log('All dependencies are pinned (no caret or tilde ranges).');
process.exit(0);
