import { gameCharacter } from '@/assets/data/characterData'
import { nextTick, reactive, toRaw, watch } from 'vue'

const character = reactive<{
  game: { [name: string]: Character }
  custom: { [name: string]: CustomCharacter }
}>({
  game: gameCharacter,
  custom: {}
})

const setWatch = () => {
  watch(character.custom, () => {
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
      data: JSON.stringify(toRaw(character.custom))
    })
}

export const getDB = () => {
  console.log('GET - SR Custom indexDB...')
  const _db = window.indexedDB.open('sr-custom')
  _db.onsuccess = (event) => {
    db = (event.target as IDBOpenDBRequest).result
    if (hasDB) {
      db.transaction('data', 'readonly').objectStore('data').get(0).onsuccess = (e) => {
        try {
          character.custom = JSON.parse((e.target as IDBRequest).result?.data || '{}')
        } finally {
          setWatch()
        }
      }
    } else {
      updateDB()
      setWatch()
    }
  }

  _db.onupgradeneeded = (event) => {
    db = (event.target as IDBOpenDBRequest).result
    if (!db.objectStoreNames.contains('data')) {
      hasDB = false
      db.createObjectStore('data', { keyPath: 'id' })
    }
  }
}

getDB()

export { character }
