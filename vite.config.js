import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron/simple';
import { resolve } from 'path';

export default defineConfig(({ command }) => {
  const isElectron = process.env.VITE_PRODUCT_MODE === 'kiosk';
  
  const config = {
    // base: './',
    plugins: [
      react({
        include: "**/*.{jsx,js}"
      })
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    define: {
      __PRODUCT_MODE__: JSON.stringify(process.env.VITE_PRODUCT_MODE || 'web'),
    },
  };

  // Add electron plugin when building for kiosk
  if (isElectron) {
    config.plugins.push(
      electron({
        main: {
          entry: 'electron/main.js',
          vite: {
            build: {
              outDir: 'dist-electron',
              rollupOptions: {
                external: ['electron']
              }
            }
          }
        },
        preload: {
          input: 'electron/preload.mjs',
          vite: {
            build: {
              outDir: 'dist-electron',
              rollupOptions: {
                external: ['electron']
              }
            }
          }
        },
        renderer: {}
      })
    );
  }

  return config;
});