import { createApp } from 'vue'
import App from './App.vue'
import './main.styl'
import '@/assets/scripts/back'
import '@/assets/scripts/analytics'
import '@/assets/scripts/preload'

(window as any).BUILD_TIME = new Date()

createApp(App).mount('#app')
