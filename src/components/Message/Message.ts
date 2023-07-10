import { user } from '@/assets/scripts/gameData'
import { getNames, getTitle } from '@/assets/scripts/header'
import { character } from '@/store/character'
import { message } from '@/store/message'
import { setting } from '@/store/setting'
import { computed, nextTick } from 'vue'

export const useMessage = () => {
  const messageIndex = computed(() => {
    if (setting.index) {
      return message.list.findIndex(item => {
        return item.id === setting.index
      })
    } else {
      return -1
    }
  })

  const names = computed(() => {
    return getNames(message.list[messageIndex.value].list)
  })

  const customTitle = computed(() => {
    if (message.list[messageIndex.value].title) return message.list[messageIndex.value].title
    return undefined
  })

  const title = computed(() => {
    if (messageIndex.value === -1) return ''

    return customTitle.value || getTitle(names.value[0])
  })

  const info = computed(() => {
    if (messageIndex.value === -1) return
    if (customTitle.value) return

    if (names.value[0].length === 1) {
      const key = names.value[1]
      let info
      if (character.game[key]) {
        info = character.game[key].info
      } else if (character.custom[key]) {
        info = character.custom[key].info
      }
      return info
    } else {
      return undefined
    }
  })

  const getUserAvatar = (key: string, url: string) => {
    if (key === '开拓者') {
      return user[setting.type].avatar || ''
    } else {
      return url
    }
  }

  return {
    messageIndex,
    title,
    info,
    getUserAvatar
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
