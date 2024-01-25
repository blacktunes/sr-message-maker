import { reactive } from 'vue'

export const avatarData = reactive<{
  index: string | number
  name?: string
}>({
  index: 0,
  name: undefined
})
