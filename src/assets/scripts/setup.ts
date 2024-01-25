import { avatar } from '@/store/avatar'
import { character } from '@/store/character'
import { message } from '@/store/message'
import { showConfirm } from '@/store/popup'
import { setting } from '@/store/setting'
import log from '../data/log'
import { IndexedDB } from './indexedDB'
import { openWindow } from './popup'

// 旧数据库兼容
const loadOldDB = () => {
  const promises: Promise<any>[] = []

  window.indexedDB.databases().then((database) => {
    if (database.find((item) => item.name === 'sr-message')) {
      promises.push(
        new Promise<void>((resolve) => {
          window.indexedDB.open('sr-message').onsuccess = (event) => {
            const db = (event.target as IDBOpenDBRequest).result
            if (db.objectStoreNames[0] === 'data') {
              db.transaction('data', 'readonly').objectStore('data').get(0).onsuccess = (e) => {
                try {
                  const data = (e.target as IDBRequest).result?.data
                  if (typeof data === 'string') {
                    message.list = JSON.parse(data)
                  } else {
                    message.list = data || {}
                  }
                } finally {
                  resolve()
                }
              }
            } else {
              resolve()
            }
          }
        })
      )
    }

    if (database.find((item) => item.name === 'sr-custom')) {
      promises.push(
        new Promise<void>((resolve) => {
          const _db = window.indexedDB.open('sr-custom')
          _db.onsuccess = (event) => {
            let flag = 0

            const db = (event.target as IDBOpenDBRequest).result
            if (db.objectStoreNames[0] === 'data') {
              db.transaction('data', 'readonly').objectStore('data').get(0).onsuccess = (e) => {
                try {
                  const data = (e.target as IDBRequest).result?.data
                  if (typeof data === 'string') {
                    character.custom = JSON.parse(data)
                  } else {
                    character.custom = data || {}
                  }
                } finally {
                  if (++flag === 2) resolve()
                }
              }

              db.transaction('data', 'readonly').objectStore('data').get(1).onsuccess = (e) => {
                const data = (e.target as IDBRequest).result?.data
                avatar.custom = data || []
                if (++flag === 2) resolve()
              }
            } else {
              resolve()
            }
          }
        })
      )
    }
  })

  return Promise.all(promises)
}

const timeout = setTimeout(() => {
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
}, 30 * 1000)

const done = () => {
  setting.loading = false
  clearTimeout(timeout)
  // closeWindow('confirm')
}

loadOldDB().finally(() => {
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

      showConfirm({
        title: '数据库初始化失败',
        text: ['短信编辑器可以正常使用', '但数据可能丢失且不会被保存']
      })
    })
})

const lastUpdate = new Date(log[0].time).getTime()
const localLastUpdate = Number(localStorage.getItem('sr-message-time'))
if (lastUpdate) {
  if (lastUpdate > localLastUpdate) {
    openWindow('log')
    localStorage.setItem('sr-message-time', JSON.stringify(lastUpdate))
  }
}
