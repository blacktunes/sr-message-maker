import { createApp } from 'vue'
import App from './App.vue'
import './main.styl'
import '@/assets/scripts/back'
import '@/assets/scripts/analytics'
import '@/assets/scripts/preload'

window.BUILD_TIME = new Date(BUILD_TIME)

createApp(App).mount('#app')
