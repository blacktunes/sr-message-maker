import { character } from '@/store/character'
import { reactive, toRef } from 'vue'
import { compressImage } from './image'
import { emoticon } from '../data/emoticon'

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
    fetch(url).then((res) =>
      res.blob().then(async (blob) => {
        if (base64) {
          resolve(await compressImage(blob))
        } else {
          resolve(URL.createObjectURL(blob))
        }
      })
    )
  })
}

const setCache = (url: string, data: string) => {
  assets[url] = data
}

const characterPreload = async () => {
  for (const i in character.avatar) {
    character.avatar[i].avatar = await getCache(character.avatar[i].avatar)
  }
  for (const i in character.game) {
    character.game[i].avatar = await getCache(character.game[i].avatar, true)
  }
  for (const i in character.other) {
    character.other[i].avatar = await getCache(character.other[i].avatar, true)
  }
}

const emoticonPreload = async () => {
  for (const i in emoticon) {
    for (const j in emoticon[i]) {
      emoticon[i][j].url = await getCache(emoticon[i][j].url, true)
    }
  }
}

const preload = () => {
  const list = import.meta.glob<string>(
    [
      // 预加载素材
      '../images/bubbles/*',
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

  for (const i in list) {
    getCache(list[i]).then((res) => {
      setCache(list[i], res)
    })
  }
}

preload()
