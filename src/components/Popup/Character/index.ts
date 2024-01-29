import { emitter } from '@/assets/scripts/event'
import { reactive } from 'vue'

export const characterData = reactive<{
  key?: [number, number]
}>({})

export const characterOpen = (key?: [number, number]) => {
  characterData.key = key
}

export const characterClose = () => {
  if (!characterData.key) {
    emitter.emit('focus')
  }
  characterData.key = undefined
}
