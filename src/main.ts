import App from './App.vue'

import './main.styl'
import '@/assets/scripts/window'
import '@/assets/scripts/analytics'
import '@/assets/scripts/keyboard'
import '@/assets/scripts/setup'

window.BUILD_TIME = new Date(BUILD_TIME)

createApp(App).mount('#app')
