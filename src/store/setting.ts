import { reactive } from 'vue'

export const setting = reactive<{
  name: string
  index?: number
  preview?: boolean
  select?: string
}>({
  name: '开拓者',
  index: undefined,
  preview: false,
  select: ''
})

setting.name = localStorage.getItem('sr-message-name') || '开拓者'

export const autoPlaySetting = reactive<{
  flag: boolean
  list: Message[]
}>({
  flag: false,
  list: []
})
