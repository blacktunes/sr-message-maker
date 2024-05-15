import { currentMessage } from '@/store/message'

export const data = reactive<{
  key?: number
  interval: number
}>({
  key: undefined,
  interval: 0
})

let confirm = () => {}
export const callback = {
  open: (key: number) => {
    data.key = key
    data.interval = (currentMessage.value?.list?.[data.key].interval || 0) / 1000
  },
  close: () => {
    data.key = undefined
    data.interval = 0
  },
  set confirm(fn: () => any) {
    confirm = fn
  },
  get confirm() {
    return () => {
      confirm()
    }
  }
}
