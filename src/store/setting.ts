import { reactive } from 'vue'

export const setting = reactive<{
  name: string
  index?: number
  select?: string
}>({
  name: '星',
  index: undefined,
  select: ''
})

setting.name = localStorage.getItem('sr-message-name') || '星'
