import './main.styl'

import App from './App.vue'

import '@/assets/scripts/window'
import '@/assets/scripts/analytics'
import '@/assets/scripts/keyboard'
import '@/assets/scripts/setup'

window.BUILD_TIME = new Date(BUILD_TIME)

createApp(App).mount('#app')
