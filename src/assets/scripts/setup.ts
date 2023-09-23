import { confirmData, popup } from '@/store/popup'
import { setting } from '@/store/setting'

const loadingFlag = {
  message: false,
  character: false,
  avatar: false
}

const errorFlag = {
  message: false,
  character: false,
  avatar: false
}

export const setLoadingType = (type: 'character' | 'message' | 'avatar', error?: boolean) => {
  loadingFlag[type] = true
  if (error) errorFlag[type] = true

  if (loadingFlag.message && loadingFlag.character && loadingFlag.avatar) {
    setting.loading = false
  }

  if (errorFlag.message || errorFlag.character || errorFlag.avatar) {
    let text = ''
    if (errorFlag.message) text = '<span style="color:red">短信</span>'
    if (errorFlag.character) {
      if (text) text += '/'
      text += '<span style="color:red">自定义角色</span>'
    }
    if (errorFlag.character) {
      if (text) text += '/'
      text += '<span style="color:red">自定义头像</span>'
    }
    confirmData.title = '数据库初始化失败'
    confirmData.text = ['短信编辑器可以正常使用', `${text}数据可能丢失且不会被保存`]
    popup.confirm = true
  }
}

