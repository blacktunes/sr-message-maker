import './main.styl'

import { analytics } from 'star-rail-vue'
import App from './App.vue'
import { loadDatabase } from './assets/scripts/database'
import { hotkey } from './assets/scripts/hotkey'
import { logCheck } from './assets/scripts/log'
import { updateCheck } from './assets/scripts/update'

window.BUILD_TIME = new Date(BUILD_TIME)

analytics('G-PW30Q3ZHX1', import.meta.env.MODE === 'development')

createApp(App).mount('#app')

hotkey()
logCheck('sr-message-update')
loadDatabase().then(updateCheck)
