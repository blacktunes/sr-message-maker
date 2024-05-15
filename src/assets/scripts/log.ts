import log from '@/assets/data/log'
import { popupManager } from './popup'

// 检查更新日志
export const logCheck = (key: string) => {
  const lastUpdate = new Date(log[0]?.time).getTime()
  const localLastUpdate = Number(localStorage.getItem(key))
  if (lastUpdate) {
    if (lastUpdate > localLastUpdate) {
      popupManager.open('log')
      localStorage.setItem(key, JSON.stringify(lastUpdate))
    }
  }
}
