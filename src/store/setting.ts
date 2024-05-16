export const setting = reactive<{
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
  /** 是否显示绿幕 */
  green: boolean
  /** 是否下载图片 */
  download: boolean
}>({
  name: '开拓者',
  avatar: DEFAULT_AVATAR,
  index: undefined,
  preview: false,
  select: '',
  bubbles: 0,
  drag: false,
  green: false,
  download: true
})

export const setName = (name: string) => {
  if (name.length < 1) {
    setting.name = '开拓者'
  } else {
    setting.name = name
  }
}

export const setAvatar = (key: string | number = DEFAULT_AVATAR) => {
  setting.avatar = key
}

try {
  const _setting = JSON.parse(localStorage.getItem('sr-message-setting') || '{}')
  if (_setting.name !== undefined) {
    setting.name = _setting.name
  }
  if (_setting.avatar !== undefined) {
    setting.avatar = _setting.avatar
  }
  if (_setting.bubbles !== undefined) {
    setting.bubbles = Number(_setting.bubbles)
  }
  if (_setting.green !== undefined) {
    setting.green = _setting.green
  }
  if (_setting.download !== undefined) {
    setting.download = _setting.download
  }
} finally {
  watch(
    [
      () => setting.name,
      () => setting.avatar,
      () => setting.bubbles,
      () => setting.green,
      () => setting.download
    ],
    () => {
      localStorage.setItem(
        'sr-message-setting',
        JSON.stringify({
          name: setting.name,
          avatar: setting.avatar,
          bubbles: setting.bubbles,
          green: setting.green,
          download: setting.download
        })
      )
    }
  )
}
