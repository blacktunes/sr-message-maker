import { createApp } from 'vue'
import App from './App.vue'
import { inject } from '@vercel/analytics'

createApp(App).mount('#app')

if (process.env.NODE_ENV !== 'development') {
  inject()
}
