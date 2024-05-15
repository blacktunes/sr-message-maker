import { useRegisterSW } from 'virtual:pwa-register/vue'
import type { WatchStopHandle } from 'vue'
import { popupManager } from './popup'

const { needRefresh, updateServiceWorker } = useRegisterSW()

export const updateCheck = () => {
  let updateWatcher: WatchStopHandle = watchEffect(() => {
    if (needRefresh.value) {
      nextTick(() => {
        updateWatcher()
      })
      popupManager.open('confirm', {
        title: '发现新版本',
        text: ['是否立刻更新？'],
        tip: '如果取消新将会在下次启动时自动更新',
        fn: () => {
          popupManager.open('loading')
          updateServiceWorker(true)
        }
      })
    }
  })
}
