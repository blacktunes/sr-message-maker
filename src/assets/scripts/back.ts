import { input } from '@/store/input'
import { popup } from '@/store/popup'
import { autoPlaySetting, setting } from '@/store/setting'
import { emitter } from './event'
import { cropper, cropperClose } from '@/store/cropper'

const handelBack = () => {
  if (popup.confirm) {
    popup.confirm = false
    return
  }

  let key: keyof typeof popup
  for (key in popup) {
    if (key === 'setting') continue
    if (popup[key]) {
      popup[key] = false
      return
    }
  }

  if (popup.setting) {
    popup.setting = false
    return
  }

  if (input.select) {
    input.select = false
    return
  }

  if (input.emoticon) {
    input.emoticon = false
    return
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

  if (cropper.show) {
    cropperClose()
    return
  }

  handelBack()
})
