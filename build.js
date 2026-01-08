const esbuild = require('esbuild');
const path = require('path');

const isWatch = process.argv.includes('--watch');

const commonOptions = {
  entryPoints: ['src/index.js'],
  bundle: true,
  sourcemap: true,
  target: ['es2018'],
  logLevel: 'info',
};

async function build() {
  // ESM build
  await esbuild.build({
    ...commonOptions,
    outfile: 'dist/mlog.esm.js',
    format: 'esm',
  });

  // UMD build (IIFE with global name)
  await esbuild.build({
    ...commonOptions,
    outfile: 'dist/mlog.umd.js',
    format: 'iife',
    globalName: '_MlogModule',
    footer: {
      js: 'var Mlog=_MlogModule.default||_MlogModule.Mlog;if(typeof module!=="undefined")module.exports=Mlog;',
    },
  });

  // Minified UMD build
  await esbuild.build({
    ...commonOptions,
    outfile: 'dist/mlog.min.js',
    format: 'iife',
    globalName: '_MlogModule',
    minify: true,
    sourcemap: false,
    footer: {
      js: 'var Mlog=_MlogModule.default||_MlogModule.Mlog;if(typeof module!=="undefined")module.exports=Mlog;',
    },
  });

  console.log('Build complete!');
}

async function watch() {
  const ctx = await esbuild.context({
    ...commonOptions,
    outfile: 'dist/mlog.esm.js',
    format: 'esm',
  });

  await ctx.watch();
  console.log('Watching for changes...');
}

if (isWatch) {
  watch();
} else {
  build();
}
