#!/usr/bin/env node
/**
 * Fails CI when npm audit reports high/critical vulnerabilities
 * in production dependencies (bounty #205).
 */
const { execSync } = require('child_process');

let audit;
try {
  audit = JSON.parse(execSync('npm audit --json', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }));
} catch (e) {
  if (e.stdout) {
    try {
      audit = JSON.parse(e.stdout);
    } catch (_) {
      console.error('Could not parse npm audit output');
      process.exit(1);
    }
  } else {
    console.error(e.message);
    process.exit(1);
  }
}

const advisories = audit.advisories || {};
const highInDirect = [];

for (const id of Object.keys(advisories)) {
  const a = advisories[id];
  if (a.severity !== 'high' && a.severity !== 'critical') continue;
  const via = a.via;
  if (typeof via === 'string' || (Array.isArray(via) && via.some((v) => typeof v === 'string'))) {
    highInDirect.push({ name: a.module_name, severity: a.severity, title: a.title });
  }
}

if (highInDirect.length > 0) {
  console.error('High/critical vulnerabilities in dependency tree:');
  highInDirect.forEach(({ name, severity, title }) => {
    console.error(`  [${severity}] ${name}: ${title}`);
  });
  console.error(`\nTotal: ${highInDirect.length}. Run npm audit fix where safe.`);
  process.exit(1);
}

console.log('No high/critical vulnerabilities reported at top level.');
process.exit(0);
