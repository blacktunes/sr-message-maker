import defaultAvatar from '@/assets/images/avatar/私聊.webp'
import { getNames, getTitle } from '@/assets/scripts/header'
import { userData } from '@/store/avatar'
import { character } from '@/store/character'
import { currentMessage } from '@/store/message'

export const blur = (e: KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === 'Escape') {
    e.preventDefault()
    e.stopPropagation()
    ;(e.target as HTMLInputElement).blur()
  }
}

const names = computed<[string[], string]>(() => {
  if (!currentMessage.value) return [[], '']

  return getNames(currentMessage.value.list)
})

const customTitle = computed(() => {
  if (!currentMessage.value) return

  return currentMessage.value.title ?? undefined
})

export const title = computed(() => {
  if (!currentMessage.value) return ''

  return customTitle.value || getTitle(names.value[0])
})

export const info = computed(() => {
  if (!currentMessage.value) return
  if (customTitle.value) return

  if (names.value[0].length === 1) {
    const key = names.value[1]
    let info
    if (character.game[key]) {
      info = character.game[key].info
    } else if (character.other[key]) {
      info = character.other[key].info
    } else if (character.custom[key]) {
      info = character.custom[key].info
    }
    return info
  } else {
    return undefined
  }
})

export const getAvatar = (key: string, url: string) => {
  if (key === '开拓者') {
    return userData.value.avatar
  } else {
    return url || defaultAvatar
  }
}

export const scrollToBottom = (dom?: HTMLElement | null, smooth?: boolean) => {
  nextTick(() => {
    if (!dom) return
    dom.scrollTo({
      top: dom.scrollHeight,
      behavior: smooth ? undefined : 'smooth'
    })
  })
}
