import { showConfirm } from '@/store/popup'
import { setting } from '@/store/setting'

type LoadingType = 'character' | 'message' | 'avatar'

const loadingFlag: Record<LoadingType, boolean> = {
  message: false,
  character: false,
  avatar: false
}

const errorFlag: Record<LoadingType, boolean> = {
  message: false,
  character: false,
  avatar: false
}

const errorText: Record<LoadingType, string> = {
  message: '短信',
  character: '头像',
  avatar: '头像'
}

export const setLoadingType = (type: LoadingType, error?: boolean) => {
  loadingFlag[type] = true
  if (error) errorFlag[type] = true

  if (Object.values(loadingFlag).every((flag) => flag)) {
    setting.loading = false
  }

  if (Object.values(errorFlag).some((flag) => flag)) {
    let text = ''
    let key: LoadingType
    for (key in errorFlag) {
      text += `${text ? '/' : ''}<span style="color:red">${errorText[key]}</span>`
    }
    showConfirm({
      title: '数据库初始化失败',
      text: ['短信编辑器可以正常使用', `${text}数据可能丢失且不会被保存`]
    })
  }
}

setTimeout(() => {
  if (Object.values(loadingFlag).some((flag) => !flag)) {
    showConfirm({
      title: '数据库加载异常',
      tip: '如果持续出现这种情况可以尝试在数据管理里重置数据库',
      text: [
        '加载时间过长，可能是数据损坏',
        '点击<span style="color:red">确认</span>可以继续使用，但是可能出现功能异常'
      ],
      fn: () => {
        setting.loading = false
      }
    })
  }
}, 30 * 1000)
