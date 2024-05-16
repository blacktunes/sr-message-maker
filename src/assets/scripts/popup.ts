import { avatar } from '@/components/Popup/Avatar'
import { bubbles } from '@/components/Popup/BubblesManager'
import ChangeLog from '@/components/Popup/ChangeLog.vue'
import { character } from '@/components/Popup/Character'
import DataManager from '@/components/Popup/DataManager.vue'
import FontManager from '@/components/Popup/FontManager.vue'
import { message } from '@/components/Popup/Message'
import Setting from '@/components/Popup/Setting.vue'
import { confirm, createPopupManager, cropper, input, loading } from 'star-rail-vue'

export const popupManager = createPopupManager({
  confirm,
  input,
  loading,
  cropper,
  bubbles,
  avatar,
  character,
  log: { component: ChangeLog },
  font: { component: FontManager },
  data: { component: DataManager },
  setting: { component: Setting },
  message
})

popupManager.open('loading')
