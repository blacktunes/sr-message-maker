import { gameCharacter, otherCharacter } from '@/assets/data/gameData'

export const character = reactive<{
  game: { [name: string]: Character }
  other: { [name: string]: OtherCharacter }
  custom: { [name: string]: CustomCharacter }
}>({
  game: gameCharacter,
  other: otherCharacter,
  custom: {}
})
