import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    BUILD_TIME: Date.now(),
    DEFAULT_TEXT: JSON.stringify('愿此行，终抵群星'),
    DEFAULT_AVATAR: JSON.stringify('星·存护')
  },
  plugins: [
    vue({
      script: {
        defineModel: true
      }
    }),
    vueJsx(),
    VitePWA({
      injectRegister: 'auto',
      manifest: {
        name: '崩坏:星穹铁道 - 短信',
        short_name: '星穹铁道短信',
        id: '/',
        display: 'fullscreen',
        orientation: 'landscape',
        background_color: '#000',
        description: '崩坏:星穹铁道短信生成器',
        icons: [
          {
            src: 'PWA/icon.webp',
            type: 'image/webp',
            sizes: '256x256'
          }
        ],
        screenshots: [
          {
            src: 'PWA/screenshot.webp',
            sizes: '1000x560',
            form_factor: 'wide'
          },
          {
            src: 'PWA/screenshot.webp',
            sizes: '1000x560'
          }
        ]
      },
      workbox: {
        // skipWaiting: true,
        runtimeCaching: [
          {
            urlPattern: /(.*?)\.(png|jpe?g|svg|gif|bmp|psd|tiff|tga|eps|ico|webp)/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache'
            }
          }
        ]
      },
      devOptions: {
        enabled: true
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
