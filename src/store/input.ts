import { reactive } from 'vue'

export const input = reactive<{
  input: string
  select: boolean
  index?: [number, number]
  character: string
}>({
  input: '',
  select: false,
  index: undefined,
  character: '开拓者'
})
