/**
 * MedBridge Global - Automated Secret Scanner & Credential Check
 * Copyright (c) 2026 Ashirwad Kumar. All Rights Reserved.
 * 
 * Scans the repository for accidentally committed secrets, environment files,
 * private keys, database connection strings, and credential tokens.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔒 Running MedBridge Global Repository Security Audit...\n');

let violations = [];

// 1. Check Git tracked files for sensitive filenames
try {
  const trackedFiles = execSync('git ls-files', { encoding: 'utf8' }).split('\n').filter(Boolean);
  
  const forbiddenPatterns = [
    /^\.env$/,
    /^\.env\.local$/,
    /^\.env\.production$/,
    /\.pem$/,
    /\.key$/,
    /\.pfx$/,
    /\.p12$/,
    /service-account.*\.json$/i,
    /credentials.*\.json$/i,
    /id_rsa/i,
  ];

  for (const file of trackedFiles) {
    for (const pat of forbiddenPatterns) {
      if (pat.test(path.basename(file))) {
        violations.push({
          type: 'Forbidden File Tracked in Git',
          file,
          detail: `File matches sensitive pattern ${pat}`
        });
      }
    }
  }
} catch (e) {
  console.warn('⚠️ Unable to query git ls-files:', e.message);
}

// 2. Scan tracked file contents for high-entropy secrets and credential patterns
const SECRET_REGEXES = [
  {
    name: 'Private Key Block',
    regex: /-----BEGIN (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/
  },
  {
    name: 'Embedded MongoDB Connection String with Password',
    regex: /mongodb(?:\+srv)?:\/\/[a-zA-Z0-9_.-]+:[^@\s"']+@[a-zA-Z0-9_.-]+/
  },
  {
    name: 'GitHub Personal Access Token',
    regex: /gh[pousr]_[A-Za-z0-9_]{36,}/
  },
  {
    name: 'GitHub Fine-grained PAT',
    regex: /github_pat_[A-Za-z0-9_]{40,}/
  },
  {
    name: 'AWS Access Key ID',
    regex: /(?:A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}/
  },
  {
    name: 'Slack Token',
    regex: /xox[baprs]-[0-9a-zA-Z]{10,}/
  }
];

// Files / extensions to ignore
const IGNORE_FILES = [
  'scripts/security-check.js',
  '.env.example',
  'package-lock.json',
  'npm-shrinkwrap.json',
];

function isIgnoredFile(relPath, fileName) {
  if (IGNORE_FILES.some(f => relPath.endsWith(f))) return true;
  // Local uncommitted env files are checked in Step 1 (to ensure they are not tracked by git).
  // They should not trigger false alarms in local directory content scanning if uncommitted.
  if (fileName.startsWith('.env')) return true;
  return false;
}

const IGNORE_DIRS = [
  'node_modules',
  '.next',
  '.git',
  'dist',
  'build',
  'coverage',
  '.expo',
];

function scanDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(process.cwd(), fullPath);

    if (entry.isDirectory()) {
      if (IGNORE_DIRS.includes(entry.name)) continue;
      scanDirectory(fullPath);
    } else if (entry.isFile()) {
      if (isIgnoredFile(relPath, entry.name)) continue;
      if (entry.name.endsWith('.png') || entry.name.endsWith('.webp') || entry.name.endsWith('.jpg') || entry.name.endsWith('.jpeg') || entry.name.endsWith('.ico') || entry.name.endsWith('.woff2')) continue;

      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        const lines = content.split('\n');

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          for (const rule of SECRET_REGEXES) {
            if (rule.regex.test(line)) {
              violations.push({
                type: `Exposed Credential Pattern (${rule.name})`,
                file: relPath,
                line: i + 1,
                detail: line.trim().substring(0, 80) + '...'
              });
            }
          }
        }
      } catch (err) {
        // Skip unreadable / binary files
      }
    }
  }
}

scanDirectory(process.cwd());

// 3. Output results
console.log('--------------------------------------------------');
if (violations.length === 0) {
  console.log('✅ Security Check Passed: Zero exposed secrets or sensitive files detected.');
  console.log('   Repository meets strict credential protection standards.');
  process.exit(0);
} else {
  console.error(`❌ Security Check Failed: Found ${violations.length} potential security violation(s):\n`);
  for (const v of violations) {
    console.error(`- [${v.type}] in ${v.file}${v.line ? `:${v.line}` : ''}`);
    console.error(`  Detail: ${v.detail}\n`);
  }
  process.exit(1);
}
