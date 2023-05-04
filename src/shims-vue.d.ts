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
}

interface MessageItem {
  time: number
  id: number
  title?: string
  list: Message[]
}

interface Character {
  name: string
  avatar: string
  info?: string
  custom?: boolean
}
