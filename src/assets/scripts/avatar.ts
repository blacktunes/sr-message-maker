import { character } from '@/store/character'

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
