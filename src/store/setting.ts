import { reactive } from 'vue'

export const setting = reactive<{
  name: string
  type: string
  index?: number
  preview?: boolean
  select?: string
}>({
  name: '开拓者',
  type: '星',
  index: undefined,
  preview: false,
  select: ''
})

export const setUserType = (key: string) => {
  setting.type = key
  localStorage.setItem('sr-message-type', setting.type)
}

setting.name = localStorage.getItem('sr-message-name') || '开拓者'
setting.type = localStorage.getItem('sr-message-type') || '星'

export const autoPlaySetting = reactive<{
  flag: boolean
  list: Message[]
}>({
  flag: false,
  list: []
})
