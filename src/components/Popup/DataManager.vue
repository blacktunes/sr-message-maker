<template>
  <Popup :index="props.index">
    <Window
      title="数据管理"
      @close="close"
    >
      <div class="data">
        <div class="box">
          <div class="info">
            <span class="label">短信数</span>
            <span class="value">{{ message.list.length }}{{ messageUsage }}</span>
          </div>
          <div
            class="info"
            style="border-top: none"
          >
            <span class="label">消息数</span>
            <span class="value">{{ messageNum }}</span>
          </div>
          <div class="btn-group">
            <div
              class="btn"
              :class="{ disable: !hasData }"
              @click="downloadAllMessage"
            >
              导出
            </div>
            <div
              class="btn"
              @click="uploadDate"
            >
              导入
            </div>
            <div
              class="btn"
              :class="{ disable: !hasData }"
              @click="deleteData"
            >
              删除
            </div>
          </div>
        </div>
        <div class="box">
          <div class="info">
            <span class="label">自定义角色</span>
            <span class="value"
              >{{ Object.keys(character.custom).length }}{{ characterUsage }}</span
            >
          </div>
          <div class="btn-group">
            <div
              class="btn"
              :class="{ disable: !hasCharacter }"
              @click="downloadCharacter"
            >
              导出
            </div>
            <div
              class="btn"
              @click="uploadCharacter"
            >
              导入
            </div>
            <div
              class="btn"
              :class="{ disable: !hasCharacter }"
              @click="deleteCharacter"
            >
              删除
            </div>
          </div>
        </div>
        <div class="box">
          <div class="info">
            <span class="label">自定义头像</span>
            <span class="value">{{ avatar.custom.length }}{{ customAvatarUsage }}</span>
          </div>
        </div>
      </div>
      <template #footer>
        <Btn
          class="btn"
          name="重置数据库"
          @click="reserDatabase"
        />
      </template>
    </Window>
  </Popup>
</template>

<script lang="ts" setup>
import { Btn, Popup, Window } from 'star-rail-vue'
import { currentMessage, message } from '@/store/message'
import { setting } from '@/store/setting'
import { character } from '@/store/character'
import { zhLocale, setLocale, Parameter } from '@ckpack/parameter'
import { avatar } from '@/store/avatar'
import { popupManager } from '@/assets/scripts/popup'
import { compressToUint8Array, decompressFromUint8Array } from 'lz-string'

const props = defineProps<{
  name: string
  index: number
}>()

const emits = defineEmits<{
  (event: 'close', name: string): void
}>()

const close = () => {
  emits('close', props.name)
}

const countStrToSize = (str: string) => {
  let count = 0
  for (let i = 0; i < str.length; i++) {
    count += Math.ceil(str.charCodeAt(i).toString(2).length / 8)
  }

  if (count === 0) return '0 B'
  const k = 1024,
    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(count) / Math.log(k))

  return `${Number((count / Math.pow(k, i)).toPrecision(3))} ${sizes[i]}`
}

const messageUsage = ref('')
const messageNum = ref(0)
const characterUsage = ref('')
const customAvatarUsage = ref('')

const updateMessageUsage = () => {
  messageUsage.value = ` (${countStrToSize(JSON.stringify(message.list))})`
  let num = 0
  message.list.forEach((i) => {
    i.list.forEach(() => {
      num += 1
    })
  })
  messageNum.value = num
}

const updateCharacterUsage = () => {
  characterUsage.value = ` (${countStrToSize(JSON.stringify(character.custom))})`
}

const updateCustomAvatarUsage = () => {
  customAvatarUsage.value = ` (${countStrToSize(JSON.stringify(avatar.custom))})`
}

watch(
  () => props.index,
  async () => {
    if (props.index !== -1) {
      updateMessageUsage()
      updateCharacterUsage()
      updateCustomAvatarUsage()
    }
  }
)

enum Accept {
  message = '.srm',
  character = '.src',
  avatar = '.sra'
}

const downloadData = (data: any, type: Accept) => {
  const str = JSON.stringify(data, null, 2)
  const blob = new Blob([compressToUint8Array(str)], { type: 'application/octet-stream' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `SR-${new Date().toLocaleString()}${type}`
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

setLocale(zhLocale)
const parameter = new Parameter()

const dataRule = {
  time: {
    type: 'number'
  },
  id: {
    type: 'number'
  },
  title: {
    isRequired: false,
    type: 'string'
  },
  list: {
    type: 'array',
    itemType: 'object',
    itemRule: {
      key: {
        type: 'string'
      },
      name: {
        type: 'string'
      },
      avatar: {
        type: 'string'
      },
      text: {
        type: 'string'
      },
      img: {
        isRequired: false,
        type: 'string'
      },
      notice: {
        isRequired: false,
        type: 'boolean'
      },
      emoticon: {
        isRequired: false,
        type: 'string'
      },
      loading: {
        isRequired: false,
        type: 'boolean'
      },
      mission: {
        isRequired: false,
        type: 'object',
        rule: {
          type: 'number',
          state: 'number'
        }
      },
      option: {
        isRequired: false,
        type: 'array',
        itemType: 'boolean'
      }
    }
  }
}

const hasData = computed(() => message.list.length > 0)

const downloadAllMessage = () => {
  if (!hasData.value) return

  downloadData(toRaw(message.list), Accept.message)
}

const uploadDate = async () => {
  const el = document.createElement('input')
  el.type = 'file'
  el.accept = Accept.message
  el.onchange = () => {
    if (el.files?.[0]) {
      const file = new FileReader()
      file.readAsArrayBuffer(el.files[0])
      file.onload = (e) => {
        if (e.target?.result) {
          try {
            const data: MessageListItem[] = JSON.parse(
              decompressFromUint8Array(new Uint8Array(e.target.result as ArrayBuffer))
            )
            let time = Date.now()
            let num = 0
            for (const i in data) {
              data[i].time = time
              data[i].id = time++
              const val = parameter.validate(dataRule, data[i])
              if (val) {
                console.warn(val)
              } else {
                message.list.unshift(data[i])
                num += 1
              }
            }
            if (num === 0) {
              popupManager.open('confirm', {
                title: '短信导入失败',
                text: ['请检查文件格式是否正确']
              })
            } else if (num < data.length) {
              popupManager.open('confirm', {
                title: '短信导入失败',
                text: ['部分短信导入失败', '请检查文件格式是否正确']
              })
            }
            updateMessageUsage()
          } catch (err) {
            popupManager.open('confirm', {
              title: '短信导入失败',
              text: [String(err)]
            })
          }
        }
      }
    }
  }
  el.click()
  el.remove()
}

const deleteData = () => {
  if (!hasData.value) return

  popupManager.open('confirm', {
    title: '删除短信',
    text: ['确定删除所有短信吗？'],
    fn: () => {
      message.list.length = 0
      updateMessageUsage()
    }
  })
}

const characterRule = {
  name: {
    type: 'string'
  },
  avatar: {
    type: 'string'
  },
  info: {
    isRequired: false,
    type: 'string'
  },
  custom: {
    type: 'boolean'
  }
}

const hasCharacter = computed(() => Object.keys(character.custom).length > 0)

const downloadCharacter = () => {
  if (!hasCharacter.value) return

  downloadData(toRaw(character.custom), Accept.character)
}

const uploadCharacter = async () => {
  const el = document.createElement('input')
  el.type = 'file'
  el.accept = Accept.character
  el.onchange = () => {
    if (el.files?.[0]) {
      const file = new FileReader()
      file.readAsArrayBuffer(el.files[0])
      file.onload = (e) => {
        if (e.target?.result) {
          try {
            const data: { [key: string]: CustomCharacter } = JSON.parse(
              decompressFromUint8Array(new Uint8Array(e.target.result as ArrayBuffer))
            )
            let time = Date.now()
            let num = 0
            for (const i in data) {
              const val = parameter.validate(characterRule, data[i])
              if (val) {
                console.warn(val)
              } else {
                character.custom[time++] = data[i]
                num += 1
              }
            }
            if (num === 0) {
              popupManager.open('confirm', {
                title: '自定义导角色入失败',
                text: ['请检查文件格式是否正确']
              })
            } else if (num < Object.keys(data).length) {
              popupManager.open('confirm', {
                title: '自定义导角色入失败',
                text: ['部分自定义导角色入失败', '请检查文件格式是否正确']
              })
            }
            updateCharacterUsage()
          } catch (err) {
            popupManager.open('confirm', {
              title: '自定义导角色入失败',
              text: [String(err)]
            })
          }
        }
      }
    }
  }
  el.click()
}

const deleteCharacter = () => {
  if (!hasCharacter.value) return

  popupManager.open('confirm', {
    title: '删除角色',
    text: ['确定删除所有自定义角色吗？'],
    fn: () => {
      Object.keys(character.custom).forEach((key) => {
        delete character.custom[key]
      })
      updateCharacterUsage()
    }
  })
}

const reserDatabase = () => {
  popupManager.open('confirm', {
    title: '重置数据库',
    tip: '该操作会清除所有短信/头像/自定义角色',
    text: ['确定重置数据库吗？'],
    fn: () => {
      popupManager.open('loading')
      const request = indexedDB.deleteDatabase('sr-message-v2')
      request.onblocked = () => {
        location.reload()
      }
      request.onsuccess = () => {
        location.reload()
      }
    }
  })
}
</script>

<style lang="stylus" scoped>
.data
  display flex
  flex-direction column
  margin 40px 0 60px
  width 1000px
  gap 30px

  .box
    box-sizing border-box
    border 4px solid rgba(0, 0, 0, 0.2)

  .info
    display flex
    justify-content space-between
    align-items center
    box-sizing border-box
    width 100%
    height 100px
    border-bottom 2px solid rgba(0, 0, 0, 0.2)
    font-size 36px

    &:last-child
      border-bottom none

    .label
      display flex
      flex 0 0 33.33%
      justify-content center
      align-items center
      height 100%
      border-right 2px solid rgba(0, 0, 0, 0.2)

    .value
      flex 1
      padding 0 50px
      color #333

  .btn-group
    display flex
    justify-content space-between
    align-items center
    box-sizing border-box
    width 100%
    height 100px
    border 2px solid rgba(0, 0, 0, 0)

    .btn
      display flex
      flex 0 0 calc(33.33% + 1px)
      justify-content center
      align-items center
      box-sizing border-box
      height 100%
      border-right 2px solid rgba(0, 0, 0, 0.2)
      color #333
      user-select none

      &:last-child
        border-right none

      &:hover
        background #ddd

.line
  width 100%
  height 30px

.disable
  color rgba(0, 0, 0, 0.2) !important
  pointer-events none
</style>
