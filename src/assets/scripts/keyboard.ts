import { input } from '@/store/input'
import { closeWindow, popup } from '@/store/popup'
import { autoPlaySetting, setting } from '@/store/setting'
import { emitter } from './event'
import { cropper, cropperClose } from '@/store/cropper'
import { messageIndex } from '@/components/Message/Message'
import { addNewMessage } from '@/store/message'

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

const hasPopup = (except: ('select' | 'autoPlay' | 'preview')[] = []) => {
  if (!except.includes('select')) {
    if (input.select) return true
  }
  if (!except.includes('autoPlay')) {
    if (autoPlaySetting.flag) return true
  }
  if (!except.includes('preview')) {
    if (setting.preview) return true
  }
  let key: keyof typeof popup
  for (key in popup) {
    if (popup[key]) {
      return true
    }
  }
  return false
}

document.addEventListener('keydown', (e) => {
  if (setting.loading) return
  switch (e.key) {
    // 保存截图
    case 's':
      if (!e.ctrlKey) return
      e.preventDefault()
      if (messageIndex.value !== -1 && !hasPopup(['autoPlay', 'preview'])) {
        if (!autoPlaySetting.flag) {
          emitter.emit('screenshot')
        }
      }
      return
    // 打开角色选择
    case 'Tab':
      e.preventDefault()
      if (messageIndex.value !== -1 && !hasPopup(['select'])) {
        input.select = !input.select
      }
      return
    case 'Enter':
      // 确认窗口
      if (closeWindow(true)) {
        e.preventDefault()
        return
      }
      // 聚焦输入框
      if (messageIndex.value !== -1 && !hasPopup()) {
        e.preventDefault()
        emitter.emit('focus')
      }
      return
    // 新短信
    case 'Insert':
      if (!hasPopup()) {
        e.preventDefault()
        addNewMessage()
      }
      return
    case 'Escape':
      if (cropper.show) {
        cropperClose()
        return
      }
      handelBack()
  }
})
