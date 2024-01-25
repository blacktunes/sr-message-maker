import { messageIndex } from '@/components/Message/Message'
import { message } from '@/store/message'
import { reactive } from 'vue'

export const messageData = reactive<{
  key?: number
  interval: number
}>({
  key: undefined,
  interval: 0
})

export const messageManagerOpen = (key: number) => {
  messageData.key = key
  messageData.interval =
    (message.list[messageIndex.value].list?.[messageData.key].interval || 0) / 1000
}

export const messageManagerClose = () => {
  messageData.key = undefined
  messageData.interval = 0
}
