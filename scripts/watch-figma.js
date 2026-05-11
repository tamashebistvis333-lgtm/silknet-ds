// Watches ~/Desktop/Tokens/ for changes to the 4 Figma Variables export files
// and auto-runs `npm run sync` when any of them is modified. Designer's flow:
//
//   1. Start once: `npm run watch` (leave the terminal open)
//   2. In Figma, make changes → File → Export Variables → unpack into
//      ~/Desktop/Tokens/ (overwriting the existing files)
//   3. Watch this terminal: it auto-rebuilds tokens, platform code, and the
//      showcase. Refresh the browser tab to see updates.
//
// Why content hashing instead of mtime? On macOS, fs.watch misses atomic-
// rename writes (archive extraction). Even fs.watchFile (which polls mtime)
// fails when files are restored with their original timestamp preserved
// (cp -p, Time Machine, Finder "Restore"). The only reliable signal is the
// file's actual content. Hashing 4 small JSONs every 1.5s is CPU-negligible.
//
// Why debounce? Figma writes the 4 JSON files in quick succession; without
// debouncing we'd kick off 4 redundant syncs.

import { existsSync, readFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = resolve(__dirname, '..');
const SOURCE_DIR = '/Users/sandrotarkhnishvili/Desktop/Tokens';
const SHOWCASE = `file://${PROJECT_DIR}/showcase/index.html`;
const POLL_INTERVAL_MS = 1500;
const DEBOUNCE_MS = 500;
const FILES = [
  'default.tokens.json',
  'Light.tokens.json',
  'Dark.tokens.json',
  'Mobile.tokens.json',
];

if (!existsSync(SOURCE_DIR)) {
  console.error(`✗ Source directory not found: ${SOURCE_DIR}`);
  console.error(`  Export Variables from Figma into this folder, then re-run.`);
  process.exit(1);
}

let running = false;
let pending = false;

function runSync(reason) {
  if (running) {
    pending = true;
    return;
  }
  running = true;
  console.log(`\n→ ${new Date().toLocaleTimeString()}  syncing (${reason})...`);
  const child = spawn('npm', ['run', 'sync'], {
    cwd: PROJECT_DIR,
    stdio: 'inherit',
  });
  child.on('exit', (code) => {
    running = false;
    if (code === 0) {
      console.log(`✔ ${new Date().toLocaleTimeString()}  sync complete — refresh the showcase tab in your browser.\n`);
    } else {
      console.error(`✗ sync failed (exit ${code}).\n`);
    }
    if (pending) {
      pending = false;
      setTimeout(() => runSync('queued'), 100);
    }
  });
}

let debounceTimer;
function scheduleSync(reason) {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => runSync(reason), DEBOUNCE_MS);
}

console.log(`👁  Watching ${SOURCE_DIR}`);
console.log(`   Files: ${FILES.join(', ')}`);
console.log(`   Showcase: ${SHOWCASE}`);
console.log(`   Polling every ${POLL_INTERVAL_MS}ms (content-hashed). Ctrl+C to stop.\n`);

// Hash content of each watched file. Returns null if the file is missing
// (briefly possible during atomic-rename extraction) so callers can compare
// against a previous null without firing.
function hashFile(path) {
  try {
    return createHash('md5').update(readFileSync(path)).digest('hex');
  } catch {
    return null;
  }
}

// Seed the initial hash table. We don't trigger sync on startup — that's a
// noisy default; the user can run `npm run sync` once if they want a fresh
// build.
const lastHash = new Map();
for (const name of FILES) lastHash.set(name, hashFile(`${SOURCE_DIR}/${name}`));

const interval = setInterval(() => {
  for (const name of FILES) {
    const path = `${SOURCE_DIR}/${name}`;
    const h = hashFile(path);
    if (h && h !== lastHash.get(name)) {
      console.log(`  • ${name} content changed`);
      lastHash.set(name, h);
      scheduleSync(name);
    } else if (h !== lastHash.get(name)) {
      // null transitions (file gone) — record but don't fire; the next
      // recreation will fire when content is back.
      lastHash.set(name, h);
    }
  }
}, POLL_INTERVAL_MS);

// Graceful shutdown
const cleanup = () => {
  console.log('\nStopping watcher.');
  clearInterval(interval);
  process.exit(0);
};
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
