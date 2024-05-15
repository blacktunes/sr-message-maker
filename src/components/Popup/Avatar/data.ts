import { avatar } from '@/store/avatar'
import { character } from '@/store/character'
import { setAvatar, setting } from '@/store/setting'

export const data = reactive<{
  index: string | number
  name?: string
}>({
  index: 0,
  name: undefined
})

let confirm = () => {}
export const callback = {
  open: () => {
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
    data.index = setting.avatar

    nextTick(() => {
      document.querySelector('.avatar_highlight')?.scrollIntoView({
        block: 'center'
      })
    })
  },
  close: () => {
    data.name = undefined
  },
  set confirm(fn: () => any) {
    confirm = fn
  },
  get confirm() {
    return () => {
      confirm()
    }
  }
}
