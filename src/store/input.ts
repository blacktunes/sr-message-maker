import { reactive } from 'vue'

export const input = reactive<{
  input: string
  select: boolean
  emoticon: boolean
  index?: [number, number]
  character: {
    key: string
    name: string
  }
}>({
  input: '',
  select: false,
  emoticon: false,
  index: undefined,
  character: {
    key: '开拓者',
    name: ''
  }
})
