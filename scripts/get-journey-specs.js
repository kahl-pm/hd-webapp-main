const fs = require('fs');
const path = require('path');

const JOURNEY_ROOT = path.resolve(__dirname, '..', 'cypress', 'e2e', 'partialE2E');

const args = process.argv.slice(2);

function usage(message) {
  const usage = [
    message,
    'Usage:',
    '  node scripts/get-journey-specs.js --bucket=a [--total=2]',
    '',
    'Options:',
    '  --bucket, -b      Bucket identifier (letter like "a" or numeric index)',
    '  --index           Numeric bucket index (0-based)',
    '  --total, -t       Total number of buckets (defaults to 2, will need to change if we increase more tests and want more parallelization)',
  ]
    .filter(Boolean)
    .join('\n');

  if (message) {
    console.error(usage);
  } else {
    console.log(usage);
  }
}

function parseArguments() {
  let bucketInput;
  let bucketIndexInput;
  let totalBuckets = 2;
  let positionalTotalConsumed = false;

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg.startsWith('--bucket=')) {
      bucketInput = arg.split('=')[1];
    } else if (arg === '--bucket' || arg === '-b') {
      if (i + 1 >= args.length) {
        throw new Error('Missing value for --bucket');
      }
      bucketInput = args[i + 1];
      i += 1;
    } else if (arg.startsWith('--index=')) {
      bucketIndexInput = arg.split('=')[1];
    } else if (arg === '--index') {
      if (i + 1 >= args.length) {
        throw new Error('Missing value for --index');
      }
      bucketIndexInput = args[i + 1];
      i += 1;
    } else if (arg.startsWith('--total=')) {
      totalBuckets = Number(arg.split('=')[1]);
    } else if (arg === '--total' || arg === '-t') {
      if (i + 1 >= args.length) {
        throw new Error('Missing value for --total');
      }
      totalBuckets = Number(args[i + 1]);
      i += 1;
    } else if (!arg.startsWith('--')) {
      if (bucketInput == null) {
        bucketInput = arg;
      } else if (!positionalTotalConsumed) {
        totalBuckets = Number(arg);
        positionalTotalConsumed = true;
      } else {
        throw new Error(`Unrecognized argument: ${arg}`);
      }
    }
  }

  if (bucketIndexInput != null && bucketInput != null) {
    throw new Error('Provide either --bucket value or --index, not both.');
  }

  if (Number.isNaN(totalBuckets) || totalBuckets < 1) {
    throw new Error(`Invalid bucket count: ${totalBuckets}`);
  }

  let bucketIndex;

  if (bucketIndexInput != null) {
    bucketIndex = Number(bucketIndexInput);
  } else if (bucketInput != null) {
    const normalized = bucketInput.toString().trim().toLowerCase();

    if (/^bucket-[a-z]+$/.test(normalized)) {
      const letter = normalized.split('-')[1];
      bucketIndex = letter.charCodeAt(0) - 'a'.charCodeAt(0);
    } else if (/^[a-z]$/.test(normalized)) {
      bucketIndex = normalized.charCodeAt(0) - 'a'.charCodeAt(0);
    } else if (/^[0-9]+$/.test(normalized)) {
      bucketIndex = Number(normalized);
    }
  }

  if (!Number.isInteger(bucketIndex) || bucketIndex < 0) {
    throw new Error('Bucket arg is required. Provide a letter (e.g. "a") or numeric index.');
  }

  if (bucketIndex >= totalBuckets) {
    throw new Error(`Bucket index ${bucketIndex} is out of range for total buckets ${totalBuckets}.`);
  }

  return { bucketIndex, totalBuckets };
}

function collectSpecFiles(rootDir) {
  if (!fs.existsSync(rootDir)) {
    throw new Error(`Journey spec directory not found: ${rootDir}`);
  }

  /** @type {string[]} */
  const specs = [];

  function walk(currentPath) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    entries.forEach((entry) => {
      if (entry.name.startsWith('.')) {
        return;
      }

      const entryPath = path.join(currentPath, entry.name);

      if (entry.isDirectory()) {
        walk(entryPath);
      } else if (entry.isFile()) {
        if (/index\.(js|ts|tsx)$/i.test(entry.name)) {
          const relative = path.relative(process.cwd(), entryPath).split(path.sep).join('/');
          specs.push(relative);
        }
      }
    });
  }

  walk(rootDir);

  return specs.sort((a, b) => a.localeCompare(b, 'en'));
}

function splitSpecs(specs, totalBuckets) {
  const buckets = Array.from({ length: totalBuckets }, () => []);

  specs.forEach((spec, index) => {
    const bucketIndex = index % totalBuckets;
    buckets[bucketIndex].push(spec);
  });

  return buckets;
}

function main() {
  try {
    const { bucketIndex, totalBuckets } = parseArguments();
    const specs = collectSpecFiles(JOURNEY_ROOT);

    if (specs.length === 0) {
      throw new Error(`No journey specs found under ${JOURNEY_ROOT}`);
    }

    const buckets = splitSpecs(specs, totalBuckets);
    const selectedBucketSpecs = buckets[bucketIndex];

    if (!selectedBucketSpecs || selectedBucketSpecs.length === 0) {
      throw new Error(`Bucket ${bucketIndex} has no specs assigned.`);
    }

    process.stdout.write(selectedBucketSpecs.join(','));
  } catch (error) {
    usage(error.message);
    process.exitCode = 1;
  }
}

main();
