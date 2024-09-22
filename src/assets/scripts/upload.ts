import { character } from '@/store/character'
import { message } from '@/store/message'
import { state } from '@/store/setting'
import { Parameter, setLocale, zhLocale } from '@ckpack/parameter'
import JSZip from 'jszip'
import { decompress, decompressFromUint8Array } from 'lz-string'
import { popupManager } from './popup'

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

export enum Accept {
  message = '.srm',
  character = '.src',
  avatar = '.sra'
}

setLocale(zhLocale)
const parameter = new Parameter()

export const uploadFile = async (file: File, open?: boolean) => {
  const accept = file.name.split('.').pop()
  if (`.${accept}` === Accept.message) {
    const reader = new FileReader()
    reader.readAsArrayBuffer(file)
    reader.onload = (e) => {
      if (e.target?.result) {
        try {
          const messageList: MessageListItem[] = JSON.parse(
            decompressFromUint8Array(new Uint8Array(e.target.result as ArrayBuffer))
          )
          let time = Date.now()
          let num = 0
          for (const i in messageList) {
            messageList[i].time = time
            messageList[i].id = time++
            const val = parameter.validate(messageRule, messageList[i])
            if (val) {
              val.forEach((err) => {
                console.warn(err.message)
              })
            } else {
              message.list.unshift(messageList[i])
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
  } else if (`.${accept}` === Accept.character) {
    const reader = new FileReader()
    reader.readAsArrayBuffer(file)
    reader.onload = (e) => {
      if (e.target?.result) {
        try {
          const characterList: { [key: string]: CustomCharacter } = JSON.parse(
            decompressFromUint8Array(new Uint8Array(e.target.result as ArrayBuffer))
          )
          let time = Date.now()
          let num = 0
          for (const i in characterList) {
            const val = parameter.validate(characterRule, characterList[i])
            if (val) {
              val.forEach((err) => {
                console.warn(err.message)
              })
            } else {
              character.custom[time++] = characterList[i]
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
    const zip = new JSZip()
    try {
      const zipContent = await zip.loadAsync(file)
      const raw = zipContent.files['raw.m']
      if (!raw) {
        throw Error()
      }
      const messageData = JSON.parse(decompress(await raw.async('text'))) as MessageListItem
      const time = Date.now()
      messageData.time = time
      messageData.id = time
      const val = parameter.validate(messageRule, messageData)
      if (val) {
        val.forEach((err) => {
          console.warn(err.message)
        })
        throw Error()
      } else {
        message.list.unshift(messageData)
        if (open) {
          state.index = messageData.id
          state.select = messageData.title || '未命名短信'
        } else {
          popupManager.open('confirm', {
            title: '短信导入完成',
            text: ['已添加新短信', messageData.title || '未命名短信']
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
