import { emitter } from '@/assets/scripts/event'

export const data = reactive<{
  key?: [number, number]
}>({})

export const callback = {
  open: (key?: [number, number]) => {
    data.key = key
  },
  close: () => {
    if (!data.key) {
      emitter.emit('focus')
    }
    data.key = undefined
  }
}
