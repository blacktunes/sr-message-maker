import { avatar } from '@/store/avatar'
import { character } from '@/store/character'
import { message } from '@/store/message'
import log from '../data/log'
import { IndexedDB } from './indexedDB'
import { popupManager } from './popup'
import { preload } from './preload'
import { useRegisterSW } from 'virtual:pwa-register/vue'
import type { WatchStopHandle } from 'vue'

const done = () => {
  popupManager.close('loading')
  clearTimeout(timeout)
  popupManager.close('confirm')
  updateCheck()
}

const loadDB = () => {
  new IndexedDB('sr-message-v2')
    .add({
      data: message,
      key: 'list',
      name: 'message'
    })
    .add({
      data: character,
      key: 'custom',
      name: 'character'
    })
    .add({
      data: avatar,
      key: 'custom',
      name: 'avatar'
    })
    .next()
    .then(done)
    .catch((err) => {
      console.error(err)

      popupManager.open('confirm', {
        title: '数据库初始化失败',
        text: ['短信编辑器可以正常使用', '但数据可能丢失且不会被保存']
      })
    })
}

// 数据库加载超时
const timeout = setTimeout(() => {
  popupManager.open('confirm', {
    title: '数据库加载异常',
    tip: '如果持续出现这种情况可以尝试在数据管理里重置数据库',
    text: [
      '加载时间过长，可能是数据损坏',
      '点击<span style="color:red">确认</span>可以继续使用，但是可能出现功能异常'
    ],
    fn: () => {
      popupManager.close('loading')
      updateCheck()
    }
  })
}, 30 * 1000)

const { needRefresh, updateServiceWorker } = useRegisterSW()
let updateWatcher: WatchStopHandle
const updateCheck = () => {
  nextTick(() => {
    if (!updateWatcher) {
      updateWatcher = watchEffect(() => {
        if (needRefresh.value) {
          popupManager.open('confirm', {
            title: '发现新版本',
            text: ['是否立刻更新？'],
            tip: '如果选择不更新将会在下次启动时自动更新',
            fn: () => {
              popupManager.open('loading')
              updateServiceWorker(true)
            }
          })
        }
      })
    }
  })
}

// 检查更新日志
const logCheck = () => {
  const lastUpdate = new Date(log[0].time).getTime()
  const localLastUpdate = Number(localStorage.getItem('sr-message-time'))
  if (lastUpdate) {
    if (lastUpdate > localLastUpdate) {
      popupManager.open('log')
      localStorage.setItem('sr-message-time', JSON.stringify(lastUpdate))
    }
  }
}

popupManager.open('loading')
loadDB()
logCheck()
preload()
