import { gameCharacter, otherCharacter, gameAvatar } from '@/assets/data/gameData'
import defaultAvatar from '@/assets/images/avatar/私聊.webp'
import { computed, reactive } from 'vue'
import { setting } from './setting'

const character = reactive<{
  game: { [name: string]: Character }
  other: { [name: string]: OtherCharacter }
  custom: { [name: string]: CustomCharacter }
  avatar: { [name: string]: UserAvatar }
  customAvatar: string[]
}>({
  game: gameCharacter,
  other: otherCharacter,
  custom: {},
  avatar: gameAvatar,
  customAvatar: []
})

const userData = computed(() => {
  const key = setting.avatar
  if (typeof key === 'string') {
    if (character.avatar[key]) {
      return {
        avatar: character.avatar[key].avatar,
        card: character.avatar[key].card
      }
    }
    if (character.game[key]) {
      return {
        avatar: character.game[key].avatar
      }
    }
    if (character.other[key]) {
      return {
        avatar: character.other[key].avatar
      }
    }
    if (character.custom[key]) {
      return {
        avatar: character.custom[key].avatar || defaultAvatar
      }
    }
  }
  if (typeof key === 'number' && character.customAvatar[key]) {
    return {
      avatar: character.customAvatar[key]
    }
  }
  return {
    avatar: character.avatar[DEFAULT_AVATAR].avatar,
    card: character.avatar[DEFAULT_AVATAR].card
  }
})

export { character, userData }
