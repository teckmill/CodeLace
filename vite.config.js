import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'js/codelace.js',
      name: 'CodeLace',
      fileName: (format) => `codelace.${format}.js`
    },
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') {
            return 'css/codelace.min.css';
          }
          return assetInfo.name;
        }
      }
    },
    outDir: 'dist',
    minify: true,
    sourcemap: true
  }
});
