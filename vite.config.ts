import { fileURLToPath, URL } from 'node:url'

import { defineConfig, splitVendorChunkPlugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    BUILD_TIME: Date.now(),
    DEFAULT_TEXT: JSON.stringify('愿此行，终抵群星'),
    DEFAULT_AVATAR: JSON.stringify('星·毁灭')
  },
  plugins: [
    vue(),
    vueJsx(),
    AutoImport({
      imports: ['vue']
    }),
    splitVendorChunkPlugin(),
    VitePWA({
      mode: 'production',
      injectRegister: 'auto',
      manifest: {
        id: '/',
        name: '崩坏:星穹铁道 - 短信',
        short_name: '星铁短信',
        description: '崩坏:星穹铁道短信生成器',
        display: 'fullscreen',
        orientation: 'landscape',
        theme_color: '#000',
        background_color: '#000',
        lang: 'zh-cn',
        icons: [
          {
            src: 'icon.webp',
            type: 'image/webp',
            sizes: '256x256'
          }
        ],
        screenshots: [
          {
            src: 'preview.webp',
            sizes: '1018x500'
          },
          {
            src: 'preview.webp',
            sizes: '1018x500',
            form_factor: 'wide'
          }
        ]
      },
      workbox: {
        // skipWaiting: true,
        disableDevLogs: true,
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
  },
  build: {
    assetsInlineLimit: 0
  }
})
