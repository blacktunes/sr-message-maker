import { character } from '@/store/character'
import { urlToBase64 } from './loader'

const avatarToBase64 = async (type: 'game' | 'other', key: string) => {
  if (character[type][key].avatar.startsWith('http')) {
    try {
      character[type][key].avatar = await urlToBase64(character[type][key].avatar, true)
    } catch {}
  }
  return character[type][key].avatar
}

export const getAvatarBase64 = async (key: string) => {
  let avatar = ''
  if (character.game[key]) {
    avatar = await avatarToBase64('game', key)
  } else if (character.other[key]) {
    avatar = await avatarToBase64('other', key)
  } else if (character.custom[key]) {
    avatar = character.custom[key].avatar
  }
  return avatar
}

export const getCharaterAvatar = (key: string) => {
  let avatar = ''
  if (character.game[key]) {
    avatar = character.game[key].avatar
  } else if (character.other[key]) {
    avatar = character.other[key].avatar
  } else if (character.custom[key]) {
    avatar = character.custom[key].avatar
  }
  return avatar
}
