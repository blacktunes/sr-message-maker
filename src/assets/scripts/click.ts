import { input } from '@/store/input'
import { setting } from '@/store/setting'

document.addEventListener('click', e => {
  if ((e.target as HTMLElement).tagName.toLowerCase() === 'a') return
  if (input.emoticon) {
    input.emoticon = false
  }
  if (input.select) {
    input.select = false
  }
  if (setting.preview) {
    setting.preview = false
  }
})
