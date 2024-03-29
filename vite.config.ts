import { fileURLToPath, URL } from 'node:url'

import { defineConfig, splitVendorChunkPlugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    BUILD_TIME: Date.now(),
    DEFAULT_TEXT: JSON.stringify('愿此行，终抵群星'),
    DEFAULT_AVATAR: JSON.stringify('星·存护')
  },
  plugins: [
    vue(),
    vueJsx(),
    AutoImport({
      imports: ['vue']
    }),
    splitVendorChunkPlugin()
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
