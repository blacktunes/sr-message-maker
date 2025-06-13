import { emitter } from '@/assets/scripts/event'
import 开拓 from '@/assets/images/开拓.webp'
import 神秘 from '@/assets/images/神秘.webp'

export const data = reactive<{
  key?: [number, number]
}>({})

export const callback = {
  open: (key?: [number, number]) => {
    data.key = key
  },
  close: () => {
    if (!data.key) {
      emitter.emit('focus')
    }
    // data.key = undefined
  }
}

export const fateList = <const>[
  '毁灭',
  '巡猎',
  '智识',
  '同谐',
  '虚无',
  '存护',
  '丰饶',
  '记忆',
  '神秘',
  '开拓'
]

declare global {
  /** 命途列表 */
  type Fate = (typeof fateList)[number]
}

type FateIcon = Partial<Record<(typeof fateList)[number], string>>

export const fateIcon: FateIcon = {
  毁灭: 'https://patchwiki.biligame.com/images/sr/5/52/irtwtwwukfi8thb62po3xrhn10vvbnj.png',
  巡猎: 'https://patchwiki.biligame.com/images/sr/f/f4/2t0cqahe051lv3g7yl0i7si4dzwzol8.png',
  智识: 'https://patchwiki.biligame.com/images/sr/4/45/0afzd3seodfwyuj2uo4riz7kblernsh.png',
  同谐: 'https://patchwiki.biligame.com/images/sr/4/44/hdfq7d3wf9spz0pjcu7xskvfa31so5z.png',
  虚无: 'https://patchwiki.biligame.com/images/sr/0/09/azlg0mqjmid9dkog5901n1zit5w34ls.png',
  存护: 'https://patchwiki.biligame.com/images/sr/3/33/gylticx4vyz8yvcgi7sv85q99gr6aar.png',
  丰饶: 'https://patchwiki.biligame.com/images/sr/d/d7/ha9pgzf4yzeqccoah30ig1ayr5oedgo.png',
  记忆: 'https://patchwiki.biligame.com/images/sr/0/05/ox6lz0ednjkh355n5lurjoda85zff7m.png',
  神秘,
  开拓
}
