import { showConfirm } from '@/store/popup'
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
    if (errorFlag.avatar) {
      if (text) text += '/'
      text += '<span style="color:red">头像</span>'
    }
    if (errorFlag.character) {
      if (text) text += '/'
      text += '<span style="color:red">自定义角色</span>'
    }
    showConfirm({
      title: '数据库初始化失败',
      text: ['短信编辑器可以正常使用', `${text}数据可能丢失且不会被保存`]
    })
  }
}

setTimeout(() => {
  if (!loadingFlag.message || !loadingFlag.character || !loadingFlag.avatar) {
    showConfirm({
      title: '数据库加载异常',
      tip: '如果持续出现这种情况可以尝试在数据管理里重置数据库',
      text: [
        '加载时间过长，可能是数据损坏',
        '点击<span style="color:red">确认</span>可以强行使用，但是可能导致功能异常'
      ],
      fn: () => {
        setting.loading = false
      }
    })
  }
}, 30 * 1000)
