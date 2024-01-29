import { watch, nextTick, toRaw } from 'vue'

export class IndexedDB {
  constructor(
    public readonly name: string,
    public readonly alias = ''
  ) {}
  private DBList: Record<
    string,
    {
      data: Record<string, any>
      key: string
      cb?: () => void
    }
  > = {}
  private hasDB = true
  db?: IDBDatabase

  private index = 0
  private doneList: Record<string, boolean> = {}
  private doneCheck = (key: string) => {
    this.doneList[key] = true
    for (const i in this.DBList) {
      if (!this.doneList[i]) return
    }
    this.cb?.()
  }
  private cb: ((value: void | PromiseLike<void>) => void) | undefined

  private setWatch = (key: string) => {
    this.doneCheck(key)
    this.DBList[key]?.cb?.()
    watch(this.DBList[key].data[this.DBList[key].key], () => {
      nextTick(() => {
        this.updateDB(key)
      })
    })
  }

  private updateDB = (key: string) => {
    if (this.db) {
      this.db
        .transaction('data', 'readwrite')
        .objectStore('data')
        .put(JSON.parse(JSON.stringify(toRaw(this.DBList[key].data[this.DBList[key].key]))), key)
    }
  }

  add = <T extends { [name: string]: any }, K extends keyof T & string>(data: {
    data: T
    key: K
    name?: string
    cb?: () => void
  }) => {
    let has = false
    for (const i in this.DBList) {
      if (this.DBList[i].data === data.data && this.DBList[i].key === data.key) {
        has = true
        break
      }
    }
    if (has) return this
    if (data.name) {
      if (data.name in this.DBList) {
        throw new Error('数据库key重复')
      } else {
        this.DBList[data.name] = {
          data: data.data,
          key: data.key,
          cb: data.cb
        }
      }
    } else {
      this.DBList[this.index++] = {
        data: data.data,
        key: data.key,
        cb: data.cb
      }
    }
    return this
  }

  next = () => {
    console.log(`正在加${this.alias}数据库...`)

    return new Promise<void>((resolve, reject) => {
      this.cb = () => resolve()
      try {
        const _db = window.indexedDB.open(this.name)
        _db.onsuccess = (event) => {
          this.db = (event.target as IDBOpenDBRequest).result
          if (this.hasDB) {
            for (const key in this.DBList) {
              this.db.transaction('data', 'readonly').objectStore('data').get(key).onsuccess = (
                res
              ) => {
                const data = (res.target as IDBRequest).result
                if (data) {
                  this.DBList[key].data[this.DBList[key].key] = data
                }
                this.setWatch(key)
              }
            }
          } else {
            for (const key in this.DBList) {
              this.updateDB(key)
              this.setWatch(key)
            }
          }
        }

        _db.onupgradeneeded = (event) => {
          this.db = (event.target as IDBOpenDBRequest).result
          if (!this.db.objectStoreNames.contains('data')) {
            this.hasDB = false
            this.db.createObjectStore('data')
          }
        }
      } catch (err) {
        reject(err)
      } finally {
        this.next = async () => {}
      }
    })
  }
}
