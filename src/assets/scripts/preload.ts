import { character } from '@/store/character'
import { reactive, toRef } from 'vue'
import { compressImage } from './image'
import { emoticon } from '../data/emoticon'
import { bubbles } from '../data/bubbles'

export const progress = reactive([0, 0])
export const assets: { [name: string]: string } = reactive({})

export const getAssets = (url: string, base64?: boolean) => {
  if (!assets[url]) {
    assets[url] = url
    getCache(url, base64).then((res) => {
      setCache(url, res)
    })
  }
  return toRef(assets, url)
}

const getCache = (url: string, base64?: boolean) => {
  return new Promise<string>((resolve) => {
    if (url) {
      progress[0] += 1

      fetch(url).then((res) =>
        res.blob().then(async (blob) => {
          if (base64) {
            resolve(await compressImage(blob))
          } else {
            resolve(URL.createObjectURL(blob))
          }
          progress[1] += 1
        })
      )
    }
  })
}

const setCache = (url: string, data: string) => {
  assets[url] = data
}

const characterPreload = () => {
  for (const i in character.game) {
    getCache(character.game[i].avatar, true).then((res) => {
      character.game[i].avatar = res
    })
  }
  for (const i in character.other) {
    getCache(character.other[i].avatar, true).then((res) => {
      character.other[i].avatar = res
    })
  }
  for (const i in character.avatar) {
    getCache(character.avatar[i].avatar).then((res) => {
      character.avatar[i].avatar = res
    })
  }
}

const emoticonPreload = () => {
  for (const i in emoticon) {
    for (const j in emoticon[i].list) {
      getCache(emoticon[i].list[j].url, true).then((res) => {
        emoticon[i].list[j].url = res
      })
    }
  }
}

const bubblesPreload = () => {
  for (const i in bubbles) {
    getCache(bubbles[i].img).then((res) => {
      bubbles[i].img = res
    })
    getCache(bubbles[i].preview).then((res) => {
      bubbles[i].preview = res
    })
  }
}

const preload = () => {
  const list = import.meta.glob<string>(
    [
      // 预加载素材
      '../images/avatar/*',
      '../images/mission/*'
    ],
    {
      eager: true,
      import: 'default'
    }
  )

  characterPreload()
  emoticonPreload()
  bubblesPreload()

  for (const i in list) {
    getAssets(list[i])
  }

  console.log(`正在预加载图片...[${progress[0]}]`)
}

preload()
