import { reactive } from 'vue'

export const input = reactive<{
  input: string
  select: boolean
  select_page: number,
  emoticon: boolean
  emoticon_page: number
  index?: [number, number]
  character: {
    key: string
    name: string
  }
}>({
  input: '',
  select: false,
  select_page: 0,
  emoticon: false,
  emoticon_page: 0,
  index: undefined,
  character: {
    key: '开拓者',
    name: ''
  }
})
