import { nextTick, reactive, toRaw, watch } from 'vue'
import { setting } from './setting'

export const message = reactive<{
  list: MessageListItem[]
}>({
  list: []
})

const setWatch = () => {
  setting.loading = false
  watch(message.list, () => {
    nextTick(() => {
      updateDB()
    })
  })
}

let hasDB = true
let db: IDBDatabase

export const updateDB = () => {
  db.transaction('data', 'readwrite')
    .objectStore('data')
    .put({
      id: 0,
      data: JSON.stringify(toRaw(message.list))
    })
}

export const getDB = () => {
  console.log('GET - SR Message indexDB...')
  const _db = window.indexedDB.open('sr-message')
  _db.onsuccess = event => {
    db = (event.target as IDBOpenDBRequest).result
    if (hasDB) {
      db.transaction('data', 'readonly')
        .objectStore('data')
        .get(0)
        .onsuccess = (e) => {
          try {
            message.list = JSON.parse((e.target as IDBRequest).result?.data || '[]')
          } finally {
            setWatch()
          }
        }
    } else {
      updateDB()
      setWatch()
    }
  }

  _db.onupgradeneeded = event => {
    db = (event.target as IDBOpenDBRequest).result
    if (!db.objectStoreNames.contains('data')) {
      hasDB = false
      db.createObjectStore('data', { keyPath: 'id' })
    }
  }
}

getDB()
