import 星_同谐 from '@/assets/images/avatar/星_同谐.webp'
import 星_记忆 from '@/assets/images/avatar/星_记忆.webp'
import 穹_同谐 from '@/assets/images/avatar/穹_同谐.webp'
import 穹_存护 from '@/assets/images/avatar/穹_存护.webp'
import 穹_毁灭 from '@/assets/images/avatar/穹_毁灭.webp'
import 穹_记忆 from '@/assets/images/avatar/穹_记忆.webp'

import staticAvatar from './static/avatar.json'
import staticCharacter from './static/character.json'

export const gameAvatar = {
  无: {
    avatar: 'https://patchwiki.biligame.com/images/sr/a/a8/1qtsu8eokug9uhap13026hk2yvdk8zb.png'
  },
  ...staticAvatar,
  '星•毁灭': {
    avatar: 'https://patchwiki.biligame.com/images/sr/5/52/rhgkx12fxucnesllif85tatcmhxqex3.png',
    card: 'https://act-upload.mihoyo.com/sr-wiki/2024/06/12/159300832/fa945988bc19ef6d44a1bad0def06b01_4529000585249072896.png?x-oss-process=image/quality,q_75/resize,s_280/format,webp'
  },
  '穹•毁灭': {
    avatar: 穹_毁灭,
    card: 'https://act-upload.mihoyo.com/sr-wiki/2024/06/12/159300832/242eea2c0f347123489412f1a039bf58_2454114231381483151.png?x-oss-process=image/quality,q_75/resize,s_280/format,webp'
  },
  '星•存护': {
    avatar: 'https://patchwiki.biligame.com/images/sr/7/71/sg4gsfp901hyfd1huaipfsbcm8p85j2.png',
    card: 'https://act-upload.mihoyo.com/sr-wiki/2024/06/12/159300832/8c065ed03caf5efbd734b125147b76e0_2239882686265020556.png?x-oss-process=image/quality,q_75/resize,s_280/format,webp'
  },
  '穹•存护': {
    avatar: 穹_存护,
    card: 'https://act-upload.mihoyo.com/sr-wiki/2023/04/24/288909604/1d351a764ae64aeed744296503bc6266_9196637429550074047.png?x-oss-process=image/quality,q_75/resize,s_280'
  },
  '星•同谐': {
    avatar: 星_同谐,
    card: 'https://act-upload.mihoyo.com/sr-wiki/2024/06/12/279865110/1428272a6d846c0e390a25a9f65b3f49_1460215812361881977.png?x-oss-process=image/quality,q_75/resize,s_280/format,webp'
  },
  '穹•同谐': {
    avatar: 穹_同谐,
    card: 'https://act-upload.mihoyo.com/sr-wiki/2024/06/14/276833758/4c5a096164da0c10df9614973a96f135_4204388553645461311.png?x-oss-process=image/quality,q_75/resize,s_280/format,webp'
  },
  '星•记忆': {
    avatar: 星_记忆,
    card: 'https://act-upload.mihoyo.com/sr-wiki/2025/02/26/276833758/9a9e555d1ea70a7f28d69ffb79cc2b0d_2040079149834133653.png?x-oss-process=image/quality,q_75/resize,s_280/format,webp'
  },
  '穹•记忆': {
    avatar: 穹_记忆,
    card: 'https://act-upload.mihoyo.com/sr-wiki/2025/02/26/276833758/3855bf3134a7f0e1af4e5ed1c17bcab2_7911394014814947811.png?x-oss-process=image/quality,q_75/resize,s_280/format,webp'
  }
} as { [name: string]: UserAvatar }

export const gameCharacter = {
  ...staticCharacter,
  '星•记忆': {
    name: '开拓者',
    avatar: 星_记忆,
    card: 'https://act-upload.mihoyo.com/sr-wiki/2025/02/26/276833758/9a9e555d1ea70a7f28d69ffb79cc2b0d_2040079149834133653.png?x-oss-process=image/quality,q_75/resize,s_280/format,webp',
    type: '记忆'
  },
  '穹•记忆': {
    name: '开拓者',
    avatar: 穹_记忆,
    card: 'https://act-upload.mihoyo.com/sr-wiki/2025/02/26/276833758/3855bf3134a7f0e1af4e5ed1c17bcab2_7911394014814947811.png?x-oss-process=image/quality,q_75/resize,s_280/format,webp',
    type: '记忆'
  },
  '星•同谐': {
    name: '开拓者',
    avatar: 星_同谐,
    card: 'https://act-upload.mihoyo.com/sr-wiki/2024/06/12/279865110/1428272a6d846c0e390a25a9f65b3f49_1460215812361881977.png?x-oss-process=image/quality,q_75/resize,s_280/format,webp',
    type: '同谐'
  },
  '穹•同谐': {
    name: '开拓者',
    avatar: 穹_同谐,
    card: 'https://act-upload.mihoyo.com/sr-wiki/2024/06/14/276833758/4c5a096164da0c10df9614973a96f135_4204388553645461311.png?x-oss-process=image/quality,q_75/resize,s_280/format,webp',
    type: '同谐'
  },
  '星•存护': {
    name: '开拓者',
    avatar: 'https://patchwiki.biligame.com/images/sr/7/71/sg4gsfp901hyfd1huaipfsbcm8p85j2.png',
    card: 'https://act-upload.mihoyo.com/sr-wiki/2024/06/12/159300832/8c065ed03caf5efbd734b125147b76e0_2239882686265020556.png?x-oss-process=image/quality,q_75/resize,s_280/format,webp',
    type: '存护'
  },
  '穹•存护': {
    name: '开拓者',
    avatar: 穹_存护,
    card: 'https://act-upload.mihoyo.com/sr-wiki/2023/04/24/288909604/1d351a764ae64aeed744296503bc6266_9196637429550074047.png?x-oss-process=image/quality,q_75/resize,s_280',
    type: '存护'
  },
  '星•毁灭': {
    name: '星•毁灭',
    avatar: 'https://patchwiki.biligame.com/images/sr/5/52/rhgkx12fxucnesllif85tatcmhxqex3.png',
    card: 'https://act-upload.mihoyo.com/sr-wiki/2024/06/12/159300832/fa945988bc19ef6d44a1bad0def06b01_4529000585249072896.png?x-oss-process=image/quality,q_75/resize,s_280/format,webp',
    type: '毁灭'
  },
  '穹•毁灭': {
    name: '开拓者',
    avatar: 穹_毁灭,
    card: 'https://act-upload.mihoyo.com/sr-wiki/2024/06/12/159300832/242eea2c0f347123489412f1a039bf58_2454114231381483151.png?x-oss-process=image/quality,q_75/resize,s_280/format,webp',
    type: '毁灭'
  }
} as { [name: string]: Character }

export const otherCharacter: { [name: string]: OtherCharacter } = {
  帕姆: {
    name: '帕姆',
    avatar: 'https://patchwiki.biligame.com/images/sr/9/9f/qxry2ls9bic9b7lmf74ouim4ls2vmy2.png',
    info: '开拓奖励找我！以后会优化',
    type: '开拓',
    custom: true,
    gold: true
  },
  匿名: {
    name: '匿名',
    avatar: '',
    type: '神秘',
    custom: true
  }
}
