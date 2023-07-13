import { input } from '@/store/input'
import { setting } from '@/store/setting'

const handelBack = () => {
  if (input.emoticon) {
    input.emoticon = false
  }
  if (input.select) {
    input.select = false
  }
  if (setting.preview) {
    setting.preview = false
  }
}

document.addEventListener('click', (e) => {
  if ((e.target as HTMLElement).tagName.toLowerCase() === 'a') return
  handelBack()
})

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return
  handelBack()
})
