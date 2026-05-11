import * as esbuild from 'esbuild';

const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');

/** @type {import('esbuild').BuildOptions} */
const sharedOptions = {
  entryPoints: ['src/extension.ts'],
  bundle: true,
  format: 'cjs',
  minify: production,
  sourcemap: !production,
  sourcesContent: false,
  external: ['vscode'],
  logLevel: 'info'
};

/** @type {import('esbuild').BuildOptions} */
const desktopOptions = {
  ...sharedOptions,
  platform: 'node',
  outfile: 'dist/extension.js'
};

/** @type {import('esbuild').BuildOptions} */
const webOptions = {
  ...sharedOptions,
  platform: 'browser',
  outfile: 'dist/web/extension.js'
};

async function main() {
  if (watch) {
    const desktopCtx = await esbuild.context(desktopOptions);
    const webCtx = await esbuild.context(webOptions);
    await Promise.all([desktopCtx.watch(), webCtx.watch()]);
  } else {
    await Promise.all([
      esbuild.build(desktopOptions),
      esbuild.build(webOptions)
    ]);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
