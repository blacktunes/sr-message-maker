import { avatar } from '@/store/avatar'
import { character } from '@/store/character'
import { setAvatar, setting } from '@/store/setting'

export const avatarData = reactive<{
  index: string | number
  name?: string
}>({
  index: 0,
  name: undefined
})

export const avatarOpen = () => {
  if (
    (typeof setting.avatar === 'string' &&
      !avatar.game[setting.avatar] &&
      !character.game[setting.avatar] &&
      !character.other[setting.avatar] &&
      !character.custom[setting.avatar]) ||
    (typeof setting.avatar === 'number' && !avatar.custom[setting.avatar])
  ) {
    setAvatar()
  }
  avatarData.index = setting.avatar

  nextTick(() => {
    document.querySelector('.avatar_highlight')?.scrollIntoView({
      block: 'center'
    })
  })
}

export const avatarClose = () => {
  avatarData.name = undefined
}
