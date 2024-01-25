import { reactive } from 'vue'

export const input = reactive<{
  /** 编辑器输入框文字 */
  input: string
  emoticon: boolean
  emoticon_page: number
  index?: [number, number]
  character: {
    key: string
    name: string
  }
}>({
  input: '',
  emoticon: false,
  emoticon_page: 0,
  index: undefined,
  character: {
    key: '开拓者',
    name: ''
  }
})
