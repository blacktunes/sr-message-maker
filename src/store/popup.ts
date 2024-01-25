import { reactive } from 'vue'
import { input } from './input'

export const popup = reactive({
  setting: false,
  log: false,
  font: false,
  data: false,
  confirm: false,
  input: false,
  avatar: false,
  message: false
})

export const popupCallbalk = reactive<{
  [key in keyof typeof popup]?: () => boolean | undefined
}>({})

export const messageData = reactive<{
  key?: number
}>({
  key: undefined
})

export const showMessageManager = (key: number) => {
  messageData.key = key
  openWindow('message')
}

export const popupList: (keyof typeof popup)[] = []

export const openWindow = (key: keyof typeof popup) => {
  if (!popup[key]) {
    popupList.push(key)
    popup[key] = true
  }
}

export const closeWindow = (confirm?: boolean) => {
  const key = popupList.pop()
  if (key) {
    if (popup[key]) {
      if (key === 'avatar' && input.select) {
        popupList.push(key)
        return
      }
      if (confirm) {
        if (!popupCallbalk?.[key]?.()) {
          popupList.push(key)
        }
      } else {
        popup[key] = false
      }
      return true
    } else {
      closeWindow(confirm)
    }
  }
}
