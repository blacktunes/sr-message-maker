import { errorData, popup } from '@/store/popup'
import { setting } from '@/store/setting'

const loadingFlag = {
  character: false,
  message: false
}

const errorFlag = {
  character: false,
  message: false
}

export const setLoadingType = (type: 'character' | 'message', error?: boolean) => {
  loadingFlag[type] = true
  if (error) errorFlag[type] = true

  if (loadingFlag.character && loadingFlag.message) {
    setting.loading = false
  }

  if (errorFlag.character || errorFlag.message) {
    let text = ''
    if (errorFlag.message) text = '<span style="color:red">短信</span>'
    if (errorFlag.character) {
      if (text) text += '/'
      text += '<span style="color:red">自定义角色</span>'
    }
    errorData.title = '数据库初始化失败'
    errorData.text = ['短信编辑器可以正常使用', `${text}可能不会被保存`]
    popup.error = true
  }
}
