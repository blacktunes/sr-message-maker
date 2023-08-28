import { reactive } from 'vue'

export const setting = reactive<{
  loading: boolean
  name: string
  type: string
  index?: number
  preview?: boolean
  select?: string
  bubbles: number
  transition: boolean
}>({
  loading: true,
  name: '开拓者',
  type: '星',
  index: undefined,
  preview: false,
  select: '',
  bubbles: 0,
  transition: true
})

export const setUserType = (key: string) => {
  setting.type = key
  localStorage.setItem('sr-message-type', setting.type)
}

setting.name = localStorage.getItem('sr-message-name') || '开拓者'
setting.type = localStorage.getItem('sr-message-type') || '星'
setting.bubbles = Number(localStorage.getItem('sr-message-bubbles')) || 0

export const autoPlaySetting = reactive<{
  flag: boolean
  list: Message[]
  option: Message[]
}>({
  flag: false,
  list: [],
  option: []
})
