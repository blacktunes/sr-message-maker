import { reactive } from 'vue'

export const input = reactive<{
  input: string
  select: boolean
  emoticon: boolean
  index?: [number, number]
  character: string
}>({
  input: '',
  select: false,
  emoticon: false,
  index: undefined,
  character: '开拓者'
})
