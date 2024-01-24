import { reactive } from 'vue'
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
