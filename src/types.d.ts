type Message<T extends keyof MessageType | undefined = undefined> = T extends undefined
  ? BaseItem &
      Partial<OptionItem> &
      Partial<MissionItem> &
      Partial<NoticeItem> &
      Partial<MessageItem>
  : BaseItem & MessageType[T]

interface MessageType {
  option: OptionItem
  mission: MissionItem
  notice: NoticeItem
  message: MessageItem
}

interface BaseItem {
  key: string
  name: string
  avatar: string
  text: string
}

interface OptionItem {
  option: [boolean]
}

interface Mission {
  type: 0 | 1 | 2 | 3 | 4
  state: 0 | 1 | 2
}

interface MissionItem {
  mission: Mission
}

interface NoticeItem {
  notice: boolean
}

interface MessageItem {
  img?: string
  emoticon?: string
  loading?: boolean
  interval?: number
}

interface MessageListItem {
  time: number
  id: number
  title?: string
  list: Message[]
}

interface Character {
  name: string
  avatar: string
  card: string
  info?: string
}

type OtherCharacter = Omit<Character, 'card'> & { gold?: boolean }

type CustomCharacter = Omit<Character, 'card'> & { custom: true }

interface Emoticon {
  name?: string
  title: string
  url: string
}

interface UserAvatar {
  avatar: string
  card?: string
}
