import { setting } from '@/store/setting'

export const getNames = (list: Message[]): [string[], string] => {
  const names: string[] = []
  let key = ''
  for (const _message of list) {
    if (_message.key !== '开拓者' && !names.includes(_message.name)) {
      if (!key) key = _message.key
      names.push(_message.name)
    }
  }
  return [names, key]
}

export const getTitle = (names: string[]) => {
  switch (names.length) {
    case 0:
      return '未命名短信'
    case 1:
      return names[0]
    default:
      return `${names.join('、')}、${setting.name}的群聊`
  }
}
