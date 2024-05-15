import { avatar } from '@/components/Popup/Avatar'
import ChangeLogVue from '@/components/Popup/ChangeLog.vue'
import { character } from '@/components/Popup/Character'
import DataManagerVue from '@/components/Popup/DataManager.vue'
import FontManagerVue from '@/components/Popup/FontManager.vue'
import { message } from '@/components/Popup/Message'
import { setting } from '@/components/Popup/Setting'
import { confirm, createPopupManager, cropper, input, loading } from 'star-rail-vue'

export const popupManager = createPopupManager({
  confirm,
  input,
  loading,
  cropper,
  setting,
  avatar,
  character,
  log: { component: ChangeLogVue },
  font: { component: FontManagerVue },
  data: { component: DataManagerVue },
  message
})

popupManager.open('loading')
