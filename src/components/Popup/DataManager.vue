<template>
  <Popup :index="props.index">
    <Window
      title="数据管理"
      @close="close"
    >
      <div class="data">
        <div class="info">
          <div>当前短信ID: {{ setting.index || '-' }}</div>
          <div style="margin-top: 20px">短信数量: {{ message.list.length }}{{ messageUsage }}</div>
          <div>消息数量: {{ messageNum }}</div>
          <div>自定义角色数量: {{ Object.keys(character.custom).length }}{{ characterUsage }}</div>
          <div>自定义头像数量: {{ avatar.custom.length }}{{ customAvatarUsage }}</div>
        </div>
        <div class="box">
          <Btn
            class="btn"
            name="导出当前短信"
            :disable="!setting.index"
            @click="downloadMessage"
          />
          <Btn
            class="btn"
            name="导出全部短信"
            :disable="!hasData"
            @click="downloadAllMessage"
          />
          <Btn
            class="btn"
            name="导入短信数据"
            @click="uploadDate"
          />
          <Btn
            class="btn"
            name="删除所有短信"
            :disable="!hasData"
            @click="deleteData"
          />
          <div class="line"></div>
          <Btn
            class="btn"
            name="导出自定义角色"
            :disable="!hasCharacter"
            @click="downloadCharacter"
          />
          <Btn
            class="btn"
            name="导入自定义角色"
            @click="uploadCharacter"
          />
          <Btn
            class="btn"
            name="删除自定义角色"
            :disable="!hasCharacter"
            @click="deleteCharacter"
          />
          <div class="line"></div>
          <Btn
            class="btn"
            name="重置数据库"
            @click="reserDatabase"
          />
        </div>
      </div>
    </Window>
  </Popup>
</template>

<script lang="ts" setup>
import Popup from '@/components/Common/Popup.vue'
import Window from '@/components/Common/Window.vue'
import Btn from '@/components/Common/Btn.vue'
import { computed, ref, toRaw, watch } from 'vue'
import { currentMessage, message } from '@/store/message'
import { setting } from '@/store/setting'
import { character } from '@/store/character'
import { zhLocale, setLocale, Parameter } from '@ckpack/parameter'
import { avatar } from '@/store/avatar'
import { openWindow } from '@/assets/scripts/popup'
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

const downloadMessage = () => {
  if (!setting.index || !currentMessage.value) return

  downloadData([toRaw(currentMessage.value)], Accept.message)
}

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
              openWindow('confirm', {
                title: '短信导入失败',
                text: ['请检查文件格式是否正确']
              })
            } else if (num < data.length) {
              openWindow('confirm', {
                title: '短信导入失败',
                text: ['部分短信导入失败', '请检查文件格式是否正确']
              })
            }
            updateMessageUsage()
          } catch (err) {
            openWindow('confirm', {
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

  openWindow('confirm', {
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
              openWindow('confirm', {
                title: '自定义导角色入失败',
                text: ['请检查文件格式是否正确']
              })
            } else if (num < Object.keys(data).length) {
              openWindow('confirm', {
                title: '自定义导角色入失败',
                text: ['部分自定义导角色入失败', '请检查文件格式是否正确']
              })
            }
            updateCharacterUsage()
          } catch (err) {
            openWindow('confirm', {
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

  openWindow('confirm', {
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
  openWindow('confirm', {
    title: '重置数据库',
    tip: '该操作会清除所有短信/头像/自定义角色',
    text: ['确定重置数据库吗？'],
    fn: () => {
      setting.loading = true
      const request = indexedDB.deleteDatabase('sr-message-v2')
      request.onsuccess = () => {
        location.reload()
      }
    }
  })
}
</script>

<style lang="stylus" scoped>
.data
  width 1000px
  margin 40px 0

  .info
    font-size 36px
    padding 30px 50px
    margin-bottom 40px
    border 2px solid rgba(0, 0, 0, 0.2)
    border-radius 10px

  .box
    width 100%

    .btn
      margin 10px 0 0 0
      height 100px
      font-size 42px

    :deep(.disable)
      border none !important

      &:before
        display block !important

  &:before
    display none

    .line
      width 100%
      margin 20px 0
      border-bottom 5px solid rgba(150, 150, 150, 0.5)

  .tip
    font-size 28px
    font-weight bold
    text-align center
    user-select none
</style>
