/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface Message {
  key: string
  name: string
  avatar: string
  text: string
  img?: string
  notice?: boolean
  emoticon?: string
  loading?: boolean
}

interface MessageListItem {
  time: number
  id: number
  title?: string
  list: Message[]
}

interface Character {
  name: string
  avatar: string
  card: string
  info?: string
}

type CustomCharacter = Omit<Character, 'card'> & { custom: true }

interface Emoticon {
  title: string
  url: string
  base64?: boolean
}