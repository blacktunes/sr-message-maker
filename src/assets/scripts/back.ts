import { input } from '@/store/input'
import { autoPlaySetting, setting } from '@/store/setting'
import { emitter } from './event'

const handelBack = () => {
  if (input.emoticon) {
    input.emoticon = false
  }
  if (input.select) {
    input.select = false
  }
  if (setting.log) {
    setting.log = false
  }
  if (autoPlaySetting.flag) {
    emitter.emit('stopplay')
    return
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
