import { user } from '@/assets/scripts/gameData'
import { character } from '@/store/character'
import { message } from '@/store/message'
import { setting } from '@/store/setting'
import { computed, nextTick } from 'vue'
import type { ComputedRef, Ref } from 'vue'

export const useMessage = (index: ComputedRef<number>) => {
  const names = computed(() => {
    const name: string[] = []
    for (const _message of message.list[index.value].list) {
      if (_message.key !== '开拓者' && !name.includes(_message.key)) {
        name.push(_message.key)
      }
    }
    return name
  })

  const customTitle = computed(() => {
    if (message.list[index.value].title) return message.list[index.value].title
    return undefined
  })

  const title = computed(() => {
    if (index.value === -1) return ''

    if (customTitle.value) return customTitle.value
    if (names.value.length === 1) return names.value[0]
    if (names.value.length > 1) return `${names.value.join('、')}、${setting.name}的群聊`
    return '未命名短信'
  })

  const info = computed(() => {
    if (index.value === -1) return
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
    title,
    info,
    getUserAvatar
  }
}

export const scrollToBottom = (dom: Ref<HTMLElement | null>, flag?: boolean) => {
  nextTick(() => {
    dom.value?.scrollTo({
      top: dom.value?.scrollHeight,
      behavior: flag ? undefined : 'smooth'
    })
  })
}
