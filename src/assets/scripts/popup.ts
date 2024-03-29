import { avatarClose, avatarOpen } from '@/components/Popup/Avatar'
import Avatar from '@/components/Popup/Avatar/Avatar.vue'
import ChangeLogVue from '@/components/Popup/ChangeLog.vue'
import { characterClose, characterOpen } from '@/components/Popup/Character'
import CharacterVue from '@/components/Popup/Character/Character.vue'
import { confirmClose, confirmOpen } from '@/components/Popup/Confirm'
import ConfirmVue from '@/components/Popup/Confirm/Confirm.vue'
import { cropperClose, cropperOpen } from '@/components/Popup/Cropper'
import CropperVue from '@/components/Popup/Cropper/Cropper.vue'
import DataManagerVue from '@/components/Popup/DataManager.vue'
import FontManagerVue from '@/components/Popup/FontManager.vue'
import { inputClose, inputOpen } from '@/components/Popup/Input'
import InputVue from '@/components/Popup/Input/Input.vue'
import { messageManagerClose, messageManagerOpen } from '@/components/Popup/Message'
import MessageManagerVue from '@/components/Popup/Message/MessageManager.vue'
import SettingVue from '@/components/Popup/Setting.vue'
import { computed, markRaw, reactive, ref, type Component, type ComputedRef } from 'vue'

const components = {
  input: InputVue,
  confirm: ConfirmVue,
  setting: SettingVue,
  avatar: Avatar,
  log: ChangeLogVue,
  font: FontManagerVue,
  data: DataManagerVue,
  message: MessageManagerVue,
  character: CharacterVue,
  cropper: CropperVue
}

const callbacks = {
  open: {
    input: inputOpen,
    confirm: confirmOpen,
    avatar: avatarOpen,
    message: messageManagerOpen,
    character: characterOpen,
    cropper: cropperOpen
  },
  close: {
    input: inputClose,
    confirm: confirmClose,
    avatar: avatarClose,
    message: messageManagerClose,
    character: characterClose,
    cropper: cropperClose
  },
  enter: {}
}

/*------------------------------------------------------------*/
type Unpacked<T> = T extends Promise<infer U> ? U : T
type ComponentKeys = keyof typeof components

export const popupComponents: Record<
  string,
  {
    compontnt: Component
    index: ComputedRef<number>
  }
> = reactive({})

/** 正在显示的组件 */
export const popup = ref<Set<ComponentKeys>>(new Set())
const _popup = computed(() => Array.from(popup.value))

/** 是否有组件显示 */
export const hasPopup = () => popup.value.size > 0

/** 最后打开的组件 */
export const currentComponent = computed<ComponentKeys | undefined>(
  () => _popup.value[_popup.value.length - 1]
)
/** 关闭最后打开的组件 */
export const closeCurrentWindow = () => {
  if (currentComponent.value) {
    closeWindow(currentComponent.value)
  }
}

/** 组件的确认事件 */
export const enterCallback: Partial<
  Record<ComponentKeys | string, () => (boolean | void) | Promise<boolean | void>>
> = callbacks.enter
/** 执行最后打开组件的确认事件 */
export const currentCallback = () => {
  if (currentComponent.value && enterCallback[currentComponent.value]) {
    return enterCallback[currentComponent.value]?.()
  }
}
let i: ComponentKeys
for (i in components) {
  const key = i
  popupComponents[i] = {
    compontnt: markRaw(components[i]),
    index: computed(() => {
      return _popup.value.indexOf(key)
    })
  }
}

namespace Open {
  export type type = Required<typeof callbacks.open>
  export type keys = keyof Open.type
  export type args<T> = T extends Open.keys ? Parameters<Open.type[T]> : []
  export type result<T> = T extends Open.keys
    ? {
        [K in Open.keys]: Unpacked<ReturnType<Open.type[K]>>
      }[T]
    : void
}
export const openWindow = async <T extends ComponentKeys>(
  key: T,
  ...args: Open.args<T>
): Promise<Open.result<T>> => {
  popup.value.add(key)
  let res
  if (key in callbacks.open) {
    res = await (callbacks.open[key as Open.keys] as (...args: any[]) => any)(...args)
  }
  return res
}

namespace Close {
  export type type = Required<typeof callbacks.close>
  export type keys = keyof Close.type
  export type args<T> = T extends Close.keys ? Parameters<Close.type[T]> : []
  export type result<T> = T extends Close.keys
    ? {
        [K in Close.keys]: Unpacked<ReturnType<Close.type[K]>>
      }[T]
    : void
}
export const closeWindow = async <T extends ComponentKeys>(
  key: T,
  ...args: Close.args<T>
): Promise<Close.result<T>> => {
  popup.value.delete(key)
  let res
  if (key in callbacks.close) {
    res = await (callbacks.close[key as Close.keys] as (...args: any[]) => any)(...args)
  }
  return res
}
