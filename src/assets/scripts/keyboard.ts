import { emoticonClose } from '@/components/Message/Emoticon'
import { autoPlay } from '@/store/autoPlay'
import { addNewMessage, currentMessage } from '@/store/message'
import { setting } from '@/store/setting'
import { emitter } from './event'
import { popupManager } from './popup'

const handleBack = () => {
  emoticonClose()

  if (autoPlay.flag) {
    emitter.emit('stopplay')
    return
  }

  if (setting.preview) {
    setting.preview = false
    return
  }

  popupManager.closeCurrentComponent()
}

document.addEventListener('click', (e) => {
  if (popupManager.isLoading()) return
  if ((e.target as HTMLElement).tagName.toLowerCase() === 'a') return
  handleBack()
})

document.addEventListener('keydown', (e) => {
  if (popupManager.isLoading()) return
  switch (e.key) {
    // 保存截图
    case 's':
      if (!e.ctrlKey) return
      e.preventDefault()
      if (currentMessage.value && !popupManager.hasPopup() && !autoPlay.flag) {
        emitter.emit('screenshot')
      }

      break
    // 打开角色选择
    case 'Tab':
      e.preventDefault()
      if (currentMessage.value && !popupManager.hasPopup() && !setting.preview) {
        popupManager.open('character')
      }

      break
    case 'Enter':
      if (autoPlay.flag) {
        emitter.emit('stopplay')
        return
      }

      if (setting.preview) return

      // 确认窗口
      if (popupManager.hasPopup()) {
        popupManager.currentComponentConfirm()
        e.preventDefault()
        return
      }

      // 聚焦输入框
      if (currentMessage.value && !popupManager.hasPopup()) {
        e.preventDefault()
        emitter.emit('focus')
        return
      }

      break
    // 新短信
    case 'Insert':
      e.preventDefault()
      if (!popupManager.hasPopup() && !setting.preview) {
        addNewMessage()
      }

      break
    case 'Escape':
      handleBack()
  }
})
