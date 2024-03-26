export const setting = reactive<{
  /** 是否显示Loading页 */
  loading: boolean
  /** 用户名 */
  name: string
  /** 用户头像 */
  avatar: string | number
  /** 当前短信ID */
  index?: number
  /** 是否预览 */
  preview: boolean
  /** 当前选择的短信分组 */
  select?: string
  /** 对话气泡 */
  bubbles: number
  /** 是否正在拖动元素 */
  drag: boolean
}>({
  loading: true,
  name: '开拓者',
  avatar: DEFAULT_AVATAR,
  index: undefined,
  preview: false,
  select: '',
  bubbles: 0,
  drag: false
})

export const setName = (name: string) => {
  if (name.length < 1) {
    setting.name = '开拓者'
  } else {
    setting.name = name
  }
  localStorage.setItem('sr-message-name', setting.name)
}

export const setAvatar = (key: string | number = DEFAULT_AVATAR) => {
  setting.avatar = key
  localStorage.setItem('sr-message-avatar', JSON.stringify(setting.avatar))
}

setting.name = localStorage.getItem('sr-message-name') || '开拓者'
try {
  setting.avatar = JSON.parse(localStorage.getItem('sr-message-avatar') || '')
} catch {
  setting.avatar = DEFAULT_AVATAR
}
setting.bubbles = Number(localStorage.getItem('sr-message-bubbles')) || 0
