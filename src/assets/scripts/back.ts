import { input } from '@/store/input'
import { closeWindow } from '@/store/popup'
import { autoPlaySetting, setting } from '@/store/setting'
import { emitter } from './event'
import { cropper, cropperClose } from '@/store/cropper'

const handelBack = () => {
  if (closeWindow()) return

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
