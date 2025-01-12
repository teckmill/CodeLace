import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

const ESM = process.env.ESM === 'true';
const BUNDLE = process.env.BUNDLE === 'true';
const PROD = process.env.NODE_ENV === 'production';

const input = 'js/src/index.ts';
const external = BUNDLE ? [] : ['@popperjs/core', '@floating-ui/dom'];

const plugins = [
  nodeResolve(),
  commonjs(),
  typescript({
    tsconfig: './tsconfig.json',
    declaration: true,
    declarationDir: './types',
    sourceMap: true
  })
];

if (PROD) {
  plugins.push(
    terser({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false
      }
    })
  );
}

function createOutput(format, suffix) {
  return {
    input,
    output: {
      file: `dist/js/codelace${suffix}.js`,
      format,
      sourcemap: true,
      name: 'CodeLace',
      exports: 'named',
      globals: {
        '@floating-ui/dom': 'FloatingUIDOM'
      }
    },
    plugins,
    external
  };
}

const configs = [];

// ESM build
configs.push({
  ...createOutput('esm', '.esm'),
  output: {
    ...createOutput('esm', '.esm').output,
    sourcemap: true
  }
});

// UMD build
configs.push(createOutput('umd', ''));

// Minified UMD build
configs.push({
  ...createOutput('umd', '.min'),
  plugins: [
    ...plugins,
    terser({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false
      }
    })
  ]
});

export default configs;
