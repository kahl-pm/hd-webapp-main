let fs;
let path;

// Some Jest/babel setups don't resolve `node:`-prefixed builtins correctly.
// Prefer `node:*` when available, but fall back for compatibility.
try {
  fs = require('node:fs');
  path = require('node:path');
} catch {
  fs = require('fs');
  path = require('path');
}

const SRC_DIR = path.join(process.cwd(), 'src');

/**
 * If you add `analyticsTrackSelection` to another component, you must explicitly
 * allowlist that file here.
 *
 * This is a guardrail to avoid accidentally expanding analytics tracking to new
 * selects without review.
 */
const ALLOWLIST = new Set([
  'src/pages/application/Referrer.tsx',
]);

const CODE_FILE_REGEX = /\.(js|jsx|ts|tsx)$/;

function toPosixPath(p) {
  return p.split(path.sep).join('/');
}

function walkDir(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const results = [];

  entries.forEach((entry) => {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkDir(fullPath));
      return;
    }

    results.push(fullPath);
  });

  return results;
}

function isCodeFile(filePath) {
  return CODE_FILE_REGEX.test(filePath) && !filePath.endsWith('.d.ts');
}

describe('analyticsTrackSelection allowlist', () => {
  test('only allowlisted files use analyticsTrackSelection', () => {
    const files = walkDir(SRC_DIR).filter(isCodeFile);

    const filesUsingAnalyticsTrackSelection = files
      .filter((absolutePath) => {
        const contents = fs.readFileSync(absolutePath, 'utf8');
        return contents.includes('analyticsTrackSelection');
      })
      .map((absolutePath) => toPosixPath(path.relative(process.cwd(), absolutePath)))
      .sort();

    const offenders = filesUsingAnalyticsTrackSelection
      .filter((relativePath) => !ALLOWLIST.has(relativePath))
      .sort();

    if (offenders.length > 0) {
      throw new Error(
        [
          'Found `analyticsTrackSelection` usage outside the allowlist.',
          '',
          'If this is intentional, add the file(s) to ALLOWLIST in:',
          '  tests/utils/analyticsTrackSelection.allowlist.test.js',
          '',
          'Offending file(s):',
          ...offenders.map((p) => `- ${p}`),
          '',
        ].join('\n'),
      );
    }

    expect(filesUsingAnalyticsTrackSelection).toEqual(Array.from(ALLOWLIST).sort());
  });
});

