/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

/** 默认文本 */
declare const DEFAULT_TEXT: string
/** 默认头像 */
declare const DEFAULT_AVATAR: string