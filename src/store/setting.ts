import { setLocalStorage } from 'star-rail-vue'

export enum KEY {
  DATABASE_NAME = 'sr-message-v2',
  SETTING_KEY = 'sr-message-setting',
  MESSAGE_FILE_ACCEPT = '.srm',
  CHARACTER_FILE_ACCEPT = '.src',
  RAW_NAME = 'raw.m',
  UPDATE_KEY = 'sr-message-update'
}

export const state = reactive<{
  /** 当前短信ID */
  index?: number
  /** 当前选择的短信分组 */
  select?: string
  /** 是否正在拖动元素 */
  drag: boolean
  /** 是否预览 */
  preview: boolean
}>({
  index: undefined,
  select: '',
  drag: false,
  preview: false
})

export const setting = reactive<{
  /** 用户名 */
  name: string
  /** 用户头像 */
  avatar: string | number
  /** 对话气泡 */
  bubbles: number
  /** 是否显示绿幕 */
  green: boolean
  /** 是否下载图片 */
  download: boolean
  /** 截图质量 */
  quality: number
}>({
  name: '开拓者',
  avatar: DEFAULT_AVATAR,
  bubbles: 0,
  green: false,
  download: true,
  quality: 1
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

setLocalStorage(setting, KEY.SETTING_KEY)
