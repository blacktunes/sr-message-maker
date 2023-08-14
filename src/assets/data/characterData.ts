import { setUserType } from '@/store/setting'
import { reactive } from 'vue'
import avatar_2 from '@/assets/images/avatar/穹.jpg'

export const user: { [name: string]: Character } = reactive({
  custom: {
    name: '开拓者',
    avatar: '',
    card: '',
  },
  星: {
    name: '开拓者',
    avatar: 'https://patchwiki.biligame.com/images/sr/f/f4/aaeqzyk10vp6orjpunclv060rdre49c.png',
    card: 'https://act-upload.mihoyo.com/sr-wiki/2023/04/24/288909604/1d351a764ae64aeed744296503bc6266_9196637429550074047.png?x-oss-process=image/quality,q_75/resize,s_280',
  },
  穹: {
    name: '开拓者',
    avatar: avatar_2,
    card: 'https://act-upload.mihoyo.com/sr-wiki/2023/04/26/288909604/bb5959b4a67a0637f6862b2c8ba163ed_3921856926987798793.png?x-oss-process=image/quality,q_75/resize,s_280',
  }
})

const avatar = localStorage.getItem('sr-message-avatar') || ''
user.custom.avatar = avatar
user.custom.card = avatar
if (avatar === '') {
  setUserType('星')
}

export const gameCharacter: { [name: string]: Character } = {
  卡芙卡: {
    name: '卡芙卡',
    avatar: 'https://patchwiki.biligame.com/images/sr/b/bc/swjc15h5lekheoa1g15hi2kcm3mi7u6.png',
    card: 'https://act-upload.mihoyo.com/sr-wiki/2023/08/02/279865110/40c0e4d56f9f19b1ee63716ed9fe7780_275097678214055588.png?x-oss-process=image/quality,q_75/resize,s_280',
    info: ''
  },
  银狼: {
    name: '银狼',
    avatar: 'https://patchwiki.biligame.com/images/sr/5/5e/r7w07iajvrc1u9tb50p69vfr9jiwu2x.png',
    card: 'https://act-upload.mihoyo.com/sr-wiki/2023/06/06/75216984/f46d36d98046af1f1826281157a2c03a_112340971313076076.png?x-oss-process=image/quality,q_75/resize,s_280',
    info: '不会做游戏就不要做'
  },
  白露: {
    name: '白露',
    avatar: 'https://patchwiki.biligame.com/images/sr/7/71/pehh3rxcf1oxy0iq2srxdrhvpgn67n1.png',
    card: 'https://act-upload.mihoyo.com/sr-wiki/2023/04/24/159305577/c684357d96e8098e898e4ee6665fd01c_7826766061944986617.png?x-oss-process=image/quality,q_75/resize,s_280',
    info: '多喝热水少生气'
  },
  希儿: {
    name: '希儿',
    avatar: 'https://patchwiki.biligame.com/images/sr/f/f4/gv7aarppc4h0n6dgkr05ufcubr2uqoe.png',
    card: 'https://act-upload.mihoyo.com/sr-wiki/2023/04/23/288909604/90322bba0235561a0da0c5b22d6edb3d_5700836084211407678.png?x-oss-process=image/quality,q_75/resize,s_280',
    info: '有话直说！！'
  },
  克拉拉: {
    name: '克拉拉',
    avatar: 'https://patchwiki.biligame.com/images/sr/3/30/mtqvfpbwq1i3wean5yafn1uxuc8y1q5.png',
    card: 'https://act-upload.mihoyo.com/sr-wiki/2023/04/24/288909604/827cb6eecdd28086ce68a1f39a9a0e09_6530506214724480230.png?x-oss-process=image/quality,q_75/resize,s_280',
    info: '想和大家去野餐(>▽<)'
  },
  布洛妮娅: {
    name: '布洛妮娅',
    avatar: 'https://patchwiki.biligame.com/images/sr/0/02/13zzf7p3j9y25i6vzpfywrreyyigk8k.png',
    card: 'https://act-upload.mihoyo.com/sr-wiki/2023/04/24/288909604/b6419ce18c6fbfbbbaffa7dd68d676f5_767729707412690608.png?x-oss-process=image/quality,q_75/resize,s_280',
    info: '会议中'
  },
  姬子: {
    name: '姬子',
    avatar: 'https://patchwiki.biligame.com/images/sr/b/b7/cx1pu6pl7h4z5b5e86fxmb2gfyqewr9.png',
    card: 'https://act-upload.mihoyo.com/sr-wiki/2023/04/24/288909604/4d5ac247ca1460b34b3f73244afbb0f6_8390343856757982675.png?x-oss-process=image/quality,q_75/resize,s_280',
    info: '可以不喝水，但不能没咖啡'
  },
  刃: {
    name: '刃',
    avatar: 'https://patchwiki.biligame.com/images/sr/e/e1/7onmk24fqdgau93wsjx8qr8th1ahgds.png',
    card: 'https://act-upload.mihoyo.com/sr-wiki/2023/07/19/75216984/7a2bbf147653d45cf77c1533e4e2ab6d_8453365043186544213.png?x-oss-process=image/quality,q_75/resize,s_280',
    info: ''
  },
  罗刹: {
    name: '罗刹',
    avatar: 'https://patchwiki.biligame.com/images/sr/2/25/n99awhmntcqvogdvksf0kl4x78dv77t.png',
    card: 'https://act-upload.mihoyo.com/sr-wiki/2023/06/27/288909604/4aad9e7c7505854cd1de96aaf45887b8_4230062706052486537.png?x-oss-process=image/quality,q_75/resize,s_280',
    info: '一介行商'
  },
  景元: {
    name: '景元',
    avatar: 'https://patchwiki.biligame.com/images/sr/7/76/lpefcuvh9gfjtdzl6wmawud5xttjhmc.png',
    card: 'https://act-upload.mihoyo.com/sr-wiki/2023/04/24/288909604/95a06162f7df44a2b068e66939268b10_2067278512630665501.png?x-oss-process=image/quality,q_75/resize,s_280',
    info: '人不在神策府'
  },
  彦卿: {
    name: '彦卿',
    avatar:
      'https://patchwiki.biligame.com/images/sr/thumb/7/77/cib5dma4hjmw0lld03q1a045pr072ey.png/180px-%E5%BD%A6%E5%8D%BF%E5%A4%B4%E5%83%8F.png',
    card: 'https://act-upload.mihoyo.com/sr-wiki/2023/04/24/288909604/cc600801af1f864cfb32bbfb01d9d867_5952117643253221767.png?x-oss-process=image/quality,q_75/resize,s_280',
    info: '今天工造司上新了么？没有'
  },
  杰帕德: {
    name: '杰帕德',
    avatar: 'https://patchwiki.biligame.com/images/sr/0/03/7ov0bzo5i63usvzxt5n7087z4lynce3.png',
    card: 'https://act-upload.mihoyo.com/sr-wiki/2023/04/25/288909604/7d7ebb840d47c8f6cdf121ae0ddf5ada_7197802014505535697.png?x-oss-process=image/quality,q_75/resize,s_280',
    info: '执勤回复较慢，请见谅'
  },
  瓦尔特: {
    name: '瓦尔特',
    avatar: 'https://patchwiki.biligame.com/images/sr/4/45/f50frnxnzqgx3lrnqz2f4hjzrlqcfae.png',
    card: 'https://act-upload.mihoyo.com/sr-wiki/2023/04/24/288909604/d5a01ddc0494595417fee74fa3285b56_8110023215605946848.png?x-oss-process=image/quality,q_75/resize,s_280',
    info: '列车组的各位，随时保持联系'
  },
  驭空: {
    name: '驭空',
    avatar: 'https://patchwiki.biligame.com/images/sr/4/44/6w0m2kw039zwln71dmmt7dpcwlao24c.png',
    card: 'https://act-upload.mihoyo.com/sr-wiki/2023/06/25/75216984/2205802801c837ef1248a1f63dc49f83_9084284062801988345.png?x-oss-process=image/quality,q_75/resize,s_280',
    info: '好想再一次回到天空...'
  },
  青雀: {
    name: '青雀',
    avatar: 'https://patchwiki.biligame.com/images/sr/3/33/pslaj26ydt1fbwo0b6v4vntsx6p277n.png',
    card: 'https://act-upload.mihoyo.com/sr-wiki/2023/04/25/289862258/2b3abc5a3dbed9d233e61c11f659473c_3453594130231722833.png?x-oss-process=image/quality,q_75/resize,s_280',
    info: '工作可以，别耽误我打牌'
  },
  素裳: {
    name: '素裳',
    avatar: 'https://patchwiki.biligame.com/images/sr/8/87/n7v209hum345c945ri82chie3eznvgs.png',
    card: 'https://act-upload.mihoyo.com/sr-wiki/2023/04/24/289862258/0f662b3c3a7f76bb8bab25dc48f3bef4_6922898942843883883.png?x-oss-process=image/quality,q_75/resize,s_280',
    info: '一读书就困是什么病症？'
  },
  停云: {
    name: '停云',
    avatar: 'https://patchwiki.biligame.com/images/sr/8/8b/rpzk2d0m6xak2n8zdfrdsfb83j6g6c4.jpg',
    card: 'https://act-upload.mihoyo.com/sr-wiki/2023/04/25/289862258/03d149b04918d43c1af097ee73858444_5948029424202771419.png?x-oss-process=image/quality,q_75/resize,s_280',
    info: '有话好好说，不要吵架~'
  },
  虎克: {
    name: '虎克',
    avatar: 'https://patchwiki.biligame.com/images/sr/5/56/36jgn9n5geaymyj8oa6xk2ddr742e6m.png',
    card: 'https://act-upload.mihoyo.com/sr-wiki/2023/04/24/159305577/ced28df529eadd5d3a65a74d7cd0f1ee_1327794469495696321.png?x-oss-process=image/quality,q_75/resize,s_280',
    info: '鼹鼠党！搏击俱乐部集合！'
  },
  娜塔莎: {
    name: '娜塔莎',
    avatar: 'https://patchwiki.biligame.com/images/sr/4/4b/1xc2p3473ga5684ij5efwhh3wu2v8rf.png',
    card: 'https://act-upload.mihoyo.com/sr-wiki/2023/04/22/288909604/98045ee394641ca42188a9c6b5ae186e_7769781659310285488.png?x-oss-process=image/quality,q_75/resize,s_280',
    info: '机械聚落巡诊，切勿跑空'
  },
  希露瓦: {
    name: '希露瓦',
    avatar: 'https://patchwiki.biligame.com/images/sr/6/6f/r7quehglkqmz806zyt5o2zromgkxhet.png',
    card: 'https://act-upload.mihoyo.com/sr-wiki/2023/04/24/159305577/e996982958ab237d46fd813099afbada_1034866961853716191.png?x-oss-process=image/quality,q_75/resize,s_280',
    info: '缺觉，缺灵感'
  },
  佩拉: {
    name: '佩拉',
    avatar:
      'https://patchwiki.biligame.com/images/sr/thumb/a/a4/rhjc3ytba6ayywljljwmkeps0x0np3y.png/180px-%E4%BD%A9%E6%8B%89%E5%A4%B4%E5%83%8F.png',
    card: 'https://act-upload.mihoyo.com/sr-wiki/2023/04/24/289862258/7099a63b46954eedc038bffc991a0437_5445770148856337075.png?x-oss-process=image/quality,q_75/resize,s_280',
    info: '情报提供请备注姓名'
  },
  黑塔: {
    name: '黑塔',
    avatar: 'https://patchwiki.biligame.com/images/sr/1/10/0nxd453fl9jm67heie9vjzbyeu4wzn6.png',
    card: 'https://act-upload.mihoyo.com/sr-wiki/2023/04/24/159305577/2f3693ba8a48e4a81832dac8344a2d14_1221820779792422378.png?x-oss-process=image/quality,q_75/resize,s_280',
    info: '此号停用|商务联系：艾丝妲'
  },
  艾丝妲: {
    name: '艾丝妲',
    avatar: 'https://patchwiki.biligame.com/images/sr/2/2b/7iarxakbkohbvt7zq75thkko9tb2xyv.png',
    card: 'https://act-upload.mihoyo.com/sr-wiki/2023/04/24/159305577/4022a164be9404b271a965ec786cbf26_7272957779066061269.png?x-oss-process=image/quality,q_75/resize,s_280',
    info: '不能再买了…'
  },
  三月七: {
    name: '三月七',
    avatar:
      'https://patchwiki.biligame.com/images/sr/thumb/3/37/1onkwhuhwsu88n9hgwma5i7uskfo32x.png/180px-%E4%B8%89%E6%9C%88%E4%B8%83%E5%A4%B4%E5%83%8F.png',
    card: 'https://act-upload.mihoyo.com/sr-wiki/2023/04/24/288909604/6a4bd3468e9dbd577f26dbf8757f0b03_924968634176225322.png?x-oss-process=image/quality,q_75/resize,s_280',
    info: '今天也是三月七~'
  },
  卢卡: {
    name: '卢卡',
    avatar: 'https://patchwiki.biligame.com/images/sr/3/34/p12qkd10ugjkhchm4f34q3j2imxh323.png',
    card: 'https://act-upload.mihoyo.com/sr-wiki/2023/07/17/75216984/0d7f1c9f746e1d4ad98b2a3360d9a27b_2137170666945226982.png?x-oss-process=image/quality,q_75/resize,s_280',
    info: '没回就是在训练！'
  },
  桑博: {
    name: '桑博',
    avatar: 'https://patchwiki.biligame.com/images/sr/7/71/ewaef9roe613lgrqz0cwmz7wui75ln9.png',
    card: 'https://act-upload.mihoyo.com/sr-wiki/2023/04/24/159305577/4021500c08db5dd7600373963a8fd7ae_2164524026920543792.png?x-oss-process=image/quality,q_75/resize,s_280',
    info: '古代遗物代理，有过验记录'
  },
  阿兰: {
    name: '阿兰',
    avatar: 'https://patchwiki.biligame.com/images/sr/1/18/148pd2d35ftfz0rn22iu3pv39vzhd0a.png',
    card: 'https://act-upload.mihoyo.com/sr-wiki/2023/04/24/159305577/d17025f2f6c52f10ccbcc93a0acd1b70_8940478888129430393.png?x-oss-process=image/quality,q_75/resize,s_280',
    info: '佩佩紧急联系人'
  },
  丹恒: {
    name: '丹恒',
    avatar: 'https://patchwiki.biligame.com/images/sr/1/16/r7lbqq30n9x4tc9t84z0a1jru1wl8ho.png',
    card: 'https://act-upload.mihoyo.com/sr-wiki/2023/04/24/159305577/e4a8703a06b4c42d692133c17b2cdc27_5408538855331042463.png?x-oss-process=image/quality,q_75/resize,s_280',
    info: '智库相关找我'
  }
}

export const otherCharacter: { [name: string]: Omit<Character, 'card'> } = {
  帕姆: {
    name: '帕姆',
    avatar: 'https://patchwiki.biligame.com/images/sr/9/9f/qxry2ls9bic9b7lmf74ouim4ls2vmy2.png',
    info: '开拓奖励找我！以后会优化'
  }
}
