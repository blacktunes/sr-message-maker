import { reactive } from 'vue'

export const autoPlay = reactive<{
  flag: boolean
  list: Message[]
  option: Message[]
}>({
  flag: false,
  list: [],
  option: []
})
