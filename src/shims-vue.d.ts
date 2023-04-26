/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface Message {
  key: string
  name: string
  text: string
  img?: string
}

interface MessageItem {
  time: number
  id: number
  title?: string
  info?: string
  list: Message[]
}