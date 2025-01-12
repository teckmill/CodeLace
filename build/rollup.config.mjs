import { babel } from '@rollup/plugin-babel';
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

const createOutput = (format, suffix) => ({
  format,
  file: `dist/js/codelace${suffix}.js`,
  name: format === 'umd' ? 'CodeLace' : undefined,
  sourcemap: true,
  exports: 'named',
  globals: BUNDLE ? {} : {
    '@popperjs/core': 'Popper',
    '@floating-ui/dom': 'FloatingUI'
  }
});

const configs = [];

// ESM build
configs.push({
  input,
  output: createOutput('esm', '.esm'),
  plugins,
  external
});

// UMD build
configs.push({
  input,
  output: createOutput('umd', BUNDLE ? '.bundle' : ''),
  plugins,
  external
});

if (PROD) {
  // Minified ESM build
  configs.push({
    input,
    output: createOutput('esm', '.esm.min'),
    plugins: [...plugins, terser()],
    external
  });

  // Minified UMD build
  configs.push({
    input,
    output: createOutput('umd', BUNDLE ? '.bundle.min' : '.min'),
    plugins: [...plugins, terser()],
    external
  });
}

export default configs;
