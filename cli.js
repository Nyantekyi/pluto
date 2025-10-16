#!/usr/bin/env node

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { PlutoInterpreter } from './src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Pluto Interpreter CLI');
  console.log('');
  console.log('Usage:');
  console.log('  pluto <file.pluto>          Run a Pluto script');
  console.log('  pluto -e "<code>"           Execute Pluto code directly');
  console.log('  pluto --version             Show version');
  console.log('  pluto --help                Show this help');
  console.log('');
  console.log('Or using Node.js directly:');
  console.log('  node cli.js <file.pluto>');
  console.log('');
  console.log('Examples:');
  console.log('  pluto script.pluto');
  console.log('  pluto -e "x = 10\\nprint(x * 2)"');
  process.exit(0);
}

if (args[0] === '--version') {
  const pkg = JSON.parse(readFileSync(join(__dirname, 'package.json'), 'utf8'));
  console.log(`Pluto Interpreter v${pkg.version}`);
  process.exit(0);
}

if (args[0] === '--help') {
  console.log('Pluto Interpreter CLI');
  console.log('');
  console.log('Usage:');
  console.log('  pluto <file.pluto>          Run a Pluto script');
  console.log('  pluto -e "<code>"           Execute Pluto code directly');
  console.log('  pluto --version             Show version');
  console.log('  pluto --help                Show this help');
  console.log('');
  console.log('Language Features:');
  console.log('  - Variables: x = 10');
  console.log('  - Actions: action add(a, b) ... end');
  console.log('  - Conditionals: check (x > 5) ... else ... end');
  console.log('  - Loops: each (item in items) ... end');
  console.log('  - While: as (condition) ... end');
  console.log('  - Built-in functions: print, abs, sqrt, min, max, etc.');
  console.log('');
  console.log('See README.md for full documentation');
  process.exit(0);
}

const pluto = new PlutoInterpreter();

try {
  let code;
  
  if (args[0] === '-e') {
    // Execute code directly
    code = args[1];
    if (!code) {
      console.error('Error: No code provided with -e flag');
      process.exit(1);
    }
  } else {
    // Read from file
    const filename = args[0];
    try {
      code = readFileSync(filename, 'utf8');
    } catch (error) {
      console.error(`Error reading file: ${error.message}`);
      process.exit(1);
    }
  }
  
  const result = pluto.execute(code);
  
  // Only print result if it's not null/undefined
  // (typically print statements return their arguments, so we show those too)
  if (result !== null && result !== undefined) {
    console.log('Result:', result);
  }
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}
