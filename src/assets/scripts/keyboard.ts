import { emoticonClose } from '@/components/Message/Emoticon'
import { autoPlay } from '@/store/autoPlay'
import { addNewMessage, currentMessage } from '@/store/message'
import { setting } from '@/store/setting'
import { emitter } from './event'
import { closeCurrentWindow, currentCallback, hasPopup, openWindow } from './popup'

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

  closeCurrentWindow()
}

document.addEventListener('click', (e) => {
  if (setting.loading) return
  if ((e.target as HTMLElement).tagName.toLowerCase() === 'a') return
  handleBack()
})

document.addEventListener('keydown', (e) => {
  if (setting.loading) return
  switch (e.key) {
    // 保存截图
    case 's':
      if (!e.ctrlKey) return
      e.preventDefault()
      if (currentMessage.value && !hasPopup() && !autoPlay.flag) {
        emitter.emit('screenshot')
      }
      return
    // 打开角色选择
    case 'Tab':
      e.preventDefault()
      if (currentMessage.value && !hasPopup()) {
        openWindow('character')
      }
      return
    case 'Enter':
      if (autoPlay.flag) {
        emitter.emit('stopplay')
        return
      }
      // 确认窗口
      if (hasPopup()) {
        currentCallback()
        e.preventDefault()
        return
      }
      // 聚焦输入框
      if (currentMessage.value && !hasPopup()) {
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
      handleBack()
  }
})
