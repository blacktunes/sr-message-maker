import { gameAvatar } from '@/assets/data/gameData'
import defaultAvatar from '@/assets/images/avatar/私聊.webp'
import { setting } from './setting'
import { character } from './character'

const avatar = reactive<{
  game: { [name: string]: UserAvatar }
  custom: string[]
}>({
  game: gameAvatar,
  custom: []
})

const userData = computed(() => {
  const key = setting.avatar
  if (typeof key === 'string') {
    if (avatar.game[key]) {
      return {
        avatar: avatar.game[key].avatar,
        card: avatar.game[key].card
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
  if (typeof key === 'number' && avatar.custom[key]) {
    return {
      avatar: avatar.custom[key]
    }
  }
  return {
    avatar: avatar.game[DEFAULT_AVATAR].avatar,
    card: avatar.game[DEFAULT_AVATAR].card
  }
})

export { avatar, userData }
