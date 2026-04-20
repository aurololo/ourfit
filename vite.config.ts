import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  // NOTE: In some sandboxed environments, reading `.env*` files can fail with EPERM.
  // We avoid `loadEnv()` here so the dev server can still boot; set env vars in the shell instead.
  const geminiApiKey = process.env.GEMINI_API_KEY ?? process.env.API_KEY ?? '';
  return {
    // Point Vite's env loading away from the repo root so it doesn't attempt to read `.env.local`.
    envDir: path.resolve(__dirname, 'env'),
    server: {
      port: 4200,
      host: '0.0.0.0',
    },
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        workbox: {
          skipWaiting: true,
          clientsClaim: true,
          cleanupOutdatedCaches: true,
        },
        includeAssets: ['icon.svg', 'OF_Logo.png'],
        manifest: {
          name: 'ourFIT',
          short_name: 'ourFIT',
          description: 'Your personal fitness companion',
          theme_color: '#0A0A0A',
          background_color: '#0A0A0A',
          display: 'standalone',
          icons: [
            {
              src: 'icon.svg',
              sizes: 'any',
              type: 'image/svg+xml',
              purpose: 'any maskable'
            }
          ]
        }
      })
    ],
    define: {
      'process.env.API_KEY': JSON.stringify(geminiApiKey),
      'process.env.GEMINI_API_KEY': JSON.stringify(geminiApiKey)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
