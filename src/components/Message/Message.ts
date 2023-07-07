import { user } from '@/assets/scripts/gameData'
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
    const name: string[] = []
    for (const _message of message.list[messageIndex.value].list) {
      if (_message.key !== '开拓者' && !name.includes(_message.key)) {
        name.push(_message.key)
      }
    }
    return name
  })

  const customTitle = computed(() => {
    if (message.list[messageIndex.value].title) return message.list[messageIndex.value].title
    return undefined
  })

  const title = computed(() => {
    if (messageIndex.value === -1) return ''

    if (customTitle.value) return customTitle.value
    if (names.value.length === 1) return names.value[0]
    if (names.value.length > 1) return `${names.value.join('、')}、${setting.name}的群聊`
    return '未命名短信'
  })

  const info = computed(() => {
    if (messageIndex.value === -1) return
    if (customTitle.value) return

    if (names.value.length === 1) {
      let info
      if (character.game[names.value[0]]) {
        info = character.game[names.value[0]].info
      } else if (character.custom[names.value[0]]) {
        info = character.custom[names.value[0]].info
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
