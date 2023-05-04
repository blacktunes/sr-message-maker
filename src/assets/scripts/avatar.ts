import { character } from '@/store/character'

export const getAvatar = (key: string) => {
  let avatar = ''
  if (character.game[key]) {
    avatar = character.game[key].avatar
  } else if (character.custom[key]) {
    avatar = character.custom[key].avatar
  }
  return avatar
}
