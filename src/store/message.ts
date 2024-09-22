import { state } from './setting'

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
  state.index = time
  state.select = title || '未命名短信'
}

export const messageIndex = computed(() => {
  if (state.index) {
    return message.list.findIndex((item) => {
      return item.id === state.index
    })
  } else {
    return -1
  }
})

export const currentMessage = computed<MessageListItem | undefined>(
  () => message.list[messageIndex.value]
)
