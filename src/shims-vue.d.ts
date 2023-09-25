/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface Window {
  BUILD_TIME: Date
}

/** 构建时间 */
declare const BUILD_TIME: number
/** 默认文本 */
declare const DEFAULT_TEXT: string
/** 默认头像 */
declare const DEFAULT_AVATAR: string
