import { gameCharacter, otherCharacter } from '@/assets/data/characterData'
import { setLoadingType } from '@/assets/scripts/setup'
import { nextTick, reactive, toRaw, watch } from 'vue'

const character = reactive<{
  game: { [name: string]: Character }
  other: { [name: string]: OtherCharacter }
  custom: { [name: string]: CustomCharacter }
  avatar: string[]
}>({
  game: gameCharacter,
  other: otherCharacter,
  custom: {},
  avatar: []
})

const setCustomWatch = () => {
  setLoadingType('character')
  watch(character.custom, () => {
    nextTick(() => {
      updateDB(0, toRaw(character.custom))
    })
  })
}

const setAvatarWatch = () => {
  setLoadingType('avatar')
  watch(character.custom, () => {
    nextTick(() => {
      updateDB(1, toRaw(character.avatar))
    })
  })
}

let hasDB = true
let db: IDBDatabase

interface UpdateDB {
  (id: 0, data: { [name: string]: CustomCharacter }): void
  (id: 1, data: string[]): void
}

export const updateDB: UpdateDB = (id, data) => {
  db.transaction('data', 'readwrite').objectStore('data').put({
    id,
    data
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
          const data = (e.target as IDBRequest).result?.data
          if (typeof data === 'string') {
            character.custom = JSON.parse(data)
          } else {
            character.custom = data || {}
          }
        } finally {
          setCustomWatch()
        }
      }

      db.transaction('data', 'readonly').objectStore('data').get(1).onsuccess = (e) => {
        try {
          const data = (e.target as IDBRequest).result?.data
          character.avatar = data || []
        } finally {
          setAvatarWatch()
        }
      }
    } else {
      updateDB(0, toRaw(character.custom))
      updateDB(1, toRaw(character.avatar))
      setCustomWatch()
      setAvatarWatch()
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

try {
  getDB()
} catch (err) {
  console.error(err)
  setLoadingType('character', true)
  setLoadingType('avatar', true)
}

export { character }
