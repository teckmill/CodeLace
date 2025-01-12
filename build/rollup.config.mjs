import { babel } from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';

const ESM = process.env.ESM === 'true';
const BUNDLE = process.env.BUNDLE === 'true';

const input = 'js/src/index.ts';
const external = BUNDLE ? [] : ['@popperjs/core'];

const plugins = [
  nodeResolve(),
  commonjs(),
  typescript({
    tsconfig: './tsconfig.json',
    declaration: true,
    declarationDir: './types'
  }),
  babel({
    exclude: 'node_modules/**',
    babelHelpers: 'bundled',
    presets: [
      ['@babel/preset-env', {
        loose: true,
        modules: false,
        targets: {
          browsers: [
            'last 2 versions',
            'not dead',
            'not ie <= 11'
          ]
        }
      }],
      '@babel/preset-typescript'
    ]
  }),
  replace({
    preventAssignment: true,
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  })
];

const rollupConfig = {
  input,
  plugins,
  external,
  output: []
};

if (ESM) {
  rollupConfig.output.push({
    format: 'esm',
    file: 'dist/js/codelace.esm.js',
    sourcemap: true,
    exports: 'named'
  });
} else {
  rollupConfig.output.push({
    format: 'umd',
    name: 'CodeLace',
    file: BUNDLE ? 'dist/js/codelace.bundle.js' : 'dist/js/codelace.js',
    sourcemap: true,
    exports: 'named',
    globals: BUNDLE ? {} : {
      '@popperjs/core': 'Popper'
    }
  });
}

export default rollupConfig;
