import * as esbuild from 'esbuild';

const commonOptions = {
  entryPoints: ['src/index.js'],
  bundle: true,
  sourcemap: true,
};

// Browser build
await esbuild.build({
  ...commonOptions,
  outfile: 'dist/pluto.browser.js',
  format: 'iife',
  globalName: 'Pluto',
  platform: 'browser',
});

// Node.js build (CommonJS)
await esbuild.build({
  ...commonOptions,
  outfile: 'dist/pluto.node.js',
  format: 'cjs',
  platform: 'node',
});

// ES Module build
await esbuild.build({
  ...commonOptions,
  outfile: 'dist/pluto.esm.js',
  format: 'esm',
  platform: 'neutral',
});

console.log('✓ Build complete');
