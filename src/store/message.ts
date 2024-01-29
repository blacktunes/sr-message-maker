import { reactive, computed } from 'vue'
import { setting } from './setting'

export const message = reactive<{
  list: MessageListItem[]
}>({
  list: []
})

export const addNewMessage = (title?: string) => {
  const time = Date.now()
  message.list.unshift({
    id: time,
    title,
    time,
    list: []
  })
  setting.index = time
  setting.select = title || '未命名短信'
}

export const messageIndex = computed(() => {
  if (setting.index) {
    return message.list.findIndex((item) => {
      return item.id === setting.index
    })
  } else {
    return -1
  }
})

export const currentMessage = computed<MessageListItem | undefined>(
  () => message.list[messageIndex.value]
)
