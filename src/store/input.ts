import { reactive } from 'vue'

export const input = reactive<{
  /** 编辑器输入框文字 */
  text: string
  /** 编辑器当前选择的角色 */
  character: {
    key: string
    name: string
  }
}>({
  text: '',
  character: {
    key: '开拓者',
    name: ''
  }
})
