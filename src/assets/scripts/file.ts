import { character } from '@/store/character'
import { message } from '@/store/message'
import { KEY, state } from '@/store/setting'
import { Parameter, setLocale, zhLocale } from '@ckpack/parameter'
import { createDownloadFile, decompressFromArrayBuffer, decompressFromZip } from 'star-rail-vue'
import { popupManager } from './popup'

setLocale(zhLocale)
const parameter = new Parameter()

const messageRule = {
  time: {
    isRequired: false,
    type: 'number'
  },
  id: {
    isRequired: false,
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

export const inputFile = async (accept: string) => {
  const el = document.createElement('input')
  el.type = 'file'
  el.accept = accept
  el.onchange = async () => {
    const file = el.files?.[0]
    if (file) {
      await importFile(file)
    }
  }
  el.click()
  el.remove()
}

export const importFile = async (file: File, open?: boolean) => {
  const accept = file.name.split('.').pop()
  if (`.${accept}` === KEY.MESSAGE_FILE_ACCEPT) {
    const reader = new FileReader()
    reader.readAsArrayBuffer(file)
    reader.onload = (e) => {
      if (e.target?.result) {
        try {
          const newDataList: MessageListItem[] = decompressFromArrayBuffer(
            e.target.result as ArrayBuffer
          )
          let time = Date.now()
          let num = 0
          for (const i in newDataList) {
            newDataList[i].time = time
            newDataList[i].id = time++
            const val = parameter.validate(messageRule, newDataList[i])
            if (val) {
              val.forEach((err) => {
                console.warn(err.message)
              })
            } else {
              message.list.unshift(newDataList[i])
              num += 1
            }
          }
          if (num === 0) {
            popupManager.open('confirm', {
              title: '短信导入失败',
              text: ['请检查文件是否正确']
            })
          } else {
            popupManager.open('confirm', {
              title: '短信导入完成',
              text: [`已添加${num}条新短信`]
            })
          }
        } catch (err) {
          popupManager.open('confirm', {
            title: '短信导入失败',
            text: [String(err)]
          })
        }
      }
    }
  } else if (`.${accept}` === KEY.CHARACTER_FILE_ACCEPT) {
    const reader = new FileReader()
    reader.readAsArrayBuffer(file)
    reader.onload = (e) => {
      if (e.target?.result) {
        try {
          const newDataList: { [key: string]: CustomCharacter } = decompressFromArrayBuffer(
            e.target.result as ArrayBuffer
          )
          let time = Date.now()
          let num = 0
          for (const i in newDataList) {
            const val = parameter.validate(characterRule, newDataList[i])
            if (val) {
              val.forEach((err) => {
                console.warn(err.message)
              })
            } else {
              character.custom[time++] = newDataList[i]
              num += 1
            }
          }
          if (num === 0) {
            popupManager.open('confirm', {
              title: '自定义导角色入失败',
              text: ['请检查文件是否正确']
            })
          } else {
            popupManager.open('confirm', {
              title: '自定义导角色入完成',
              text: [`已添加${num}个新角色`]
            })
          }
        } catch (err) {
          popupManager.open('confirm', {
            title: '自定义导角色入失败',
            text: [String(err)]
          })
        }
      }
    }
  } else {
    try {
      const newData = await decompressFromZip<MessageListItem>(file, KEY.RAW_NAME)
      const time = Date.now()
      newData.time = time
      newData.id = time
      const val = parameter.validate(messageRule, newData)
      if (val) {
        val.forEach((err) => {
          console.warn(err.message)
        })
        throw Error()
      } else {
        message.list.unshift(newData)
        if (open) {
          state.index = newData.id
          state.select = newData.title || '未命名短信'
        } else {
          popupManager.open('confirm', {
            title: '短信导入完成',
            text: ['已添加新短信', newData.title || '未命名短信']
          })
        }
      }
    } catch {
      popupManager.open('confirm', {
        title: '短信导入失败',
        text: ['该文件可能不是由短信生成器导出或内容已被修改']
      })
    }
  }
}

export const exportFile = (
  data: any,
  type: KEY.CHARACTER_FILE_ACCEPT | KEY.MESSAGE_FILE_ACCEPT
) => {
  const blob = createDownloadFile(data)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `SR-${new Date().toLocaleString()}${type}`
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
