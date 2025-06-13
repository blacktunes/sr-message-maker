<template>
  <Popup
    :index="props.index"
    show
  >
    <div
      class="character-select"
      @click.stop
    >
      <Close
        color="#fff"
        class="close"
        @click.stop="close"
      />
      <Transition
        name="box-slide-bottom"
        appear
      >
        <div class="left">
          <GroupBtn
            type="全部"
            :highlight="select === '全部'"
            @click="select = '全部'"
          />
          <div class="group-list">
            <GroupBtn
              v-for="name in fateList"
              :key="name"
              :type="name"
              :highlight="select === name"
              @click="select = name"
            />
          </div>
        </div>
      </Transition>
      <Transition
        name="box-slide-bottom"
        appear
      >
        <div class="right">
          <CharacterCard
            v-if="!(data.key && data.key[0] === -1)"
            :custom="!userData.card && !setting.local_character"
            :name="setting.name"
            :avatar="userData.card || userData.avatar"
            :level="!userData.card ? 5 : undefined"
            title="你"
            info="[短信发送者]"
            @click="handlecharacterClick('开拓者', '')"
            @contextmenu.prevent.stop
          />
          <CharacterCard
            v-for="(item, key) in CharacterList"
            :key="key"
            :custom="!item.type || item.custom"
            :name="item.type ? key : item.name"
            :info="item.info"
            :avatar="item.card || item.avatar"
            :level="item.gold ? 5 : undefined"
            @click="handlecharacterClick(String(key), item.name)"
            @contextmenu.prevent.stop="
              !item.type ? handleDelClick(String(key), item.name) : undefined
            "
          >
            <div
              v-if="!item.type"
              class="del"
              @click.stop="handleDelClick(String(key), item.name)"
            >
              <Icon
                name="delete"
                width="25"
                height="25"
              />
            </div>
          </CharacterCard>
          <div
            v-if="select === '全部' || select === '神秘'"
            class="add"
            @click="addCustom"
          >
            <Icon name="add" />
          </div>
        </div>
      </Transition>
    </div>
  </Popup>
</template>

<script lang="ts" setup>
import { getAvatarBase64 } from '@/assets/scripts/avatar'
import { popupManager } from '@/assets/scripts/popup'
import CharacterCard from '@/components/Character/CharacterCard.vue'
import Icon from '@/components/Common/Icon.vue'
import { data as avatarData } from '@/components/Popup/Avatar/data'
import { userData } from '@/store/avatar'
import { character } from '@/store/character'
import { input } from '@/store/input'
import { message } from '@/store/message'
import { setting } from '@/store/setting'
import { Close, Popup } from 'star-rail-vue'
import { data, fateList } from './data'
import GroupBtn from './GroupBtn.vue'

const select = ref<'全部' | Fate>('全部')

const filter = <T extends { [key: string]: any }>(obj: T, fn: (...arg: any) => boolean) =>
  Object.keys(obj)
    .filter((key) => fn(obj[key]))
    .reduce((res: { [key: string]: any }, key) => {
      res[key] = obj[key]
      return res
    }, {})

const CharacterList = computed(() => {
  let list: { [key: string]: any }
  if (select.value === '全部') {
    list = { ...character.game, ...character.other, ...character.custom }
  } else if (select.value === '神秘') {
    list = { ...filter(character.other, (item) => item.type === select.value), ...character.custom }
  } else {
    list = filter({ ...character.game, ...character.other }, (item) => item.type === select.value)
  }
  if (data.key && data.key[0] === -1) {
    list = Object.keys(list).reduce((res: { [key: string]: any }, key) => {
      if (!key.startsWith('星•') && !key.startsWith('穹•')) {
        res[key] = list[key]
      }
      return res
    }, {})
  }
  return list
})

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

const handlecharacterClick = async (key: string, name: string) => {
  if (data.key) {
    if (data.key[0] === -1) {
      if (key !== '开拓者') {
        avatarData.index = key
        avatarData.name = name
        avatarData.local = true
      } else {
        avatarData.index = setting.avatar
        avatarData.name = setting.name
      }
    } else {
      message.list[data.key[0]].list[data.key[1]].key = key
      message.list[data.key[0]].list[data.key[1]].name = name
      message.list[data.key[0]].list[data.key[1]].avatar = await getAvatarBase64(key)
    }
  } else {
    input.character.key = key
    input.character.name = name
  }
  close()
}

const addCustom = async () => {
  const name = await popupManager.open('input', { title: '请输入角色名' })
  if (name === null) return

  const info =
    (await popupManager.open('input', {
      title: '请输入角色签名',
      tip: '非必要选项',
      required: false
    })) ?? ''
  const key = Date.now()

  popupManager
    .open('cropper', {
      aspectRatio: 1,
      maxWidth: 500
    })
    .then(({ base64 }) => {
      character.custom[key] = {
        name,
        avatar: base64,
        info,
        custom: true
      }
    })
}

const handleDelClick = (key: string, name: string) => {
  popupManager.open('confirm', {
    title: '删除角色',
    text: [`是否删除${name}？`],
    fn: () => {
      delete character.custom[key]
    }
  })
}
</script>

<style lang="stylus" scoped>
$top = 30px

.character-select
  position absolute
  top 10px
  left 10px
  display flex
  overflow hidden
  box-sizing border-box
  padding 30px 60px
  width calc(100% - 20px)
  height calc(100% - 20px)
  background #000
  background-image url('https://patchwiki.biligame.com/images/sr/2/29/tjd2rlq7gbac4k46mnum5fvtt1218r8.png')
  background-position 100% 0
  background-size 103%
  background-repeat no-repeat

  &:before
    position absolute
    top 40px
    right 50px
    bottom 40px
    left 50px
    border 5px solid rgba(100, 100, 100, 0.3)
    border-radius 5px
    content ''
    pointer-events none

  .close
    position absolute
    top 100px
    right 85px
    z-index 1

  .left
    display flex
    flex-direction column
    margin $top 150px $top 15px
    width 300px
    height s('calc(100% - %s)', $top * 2)

    .group-list
      display flex
      flex 1
      flex-direction column
      overflow-x hidden
      overflow-y auto
      overflow-y overlay
      scrollbar-gutter stable
      scrollbar-width none
      mask-image linear-gradient(to bottom, transparent, #000 25px, #000 calc(100% - 25px), transparent)

      &::-webkit-scrollbar
        width 0
        height 0

  .right
    display flex
    flex 1
    flex-wrap wrap
    align-content flex-start
    overflow-x hidden
    overflow-y auto
    overflow-y overlay
    box-sizing border-box
    margin ($top + 15px) 35px ($top + 15px) 0
    height s('calc(100% - %s)', ($top + 15px) * 2)
    scrollbar-gutter stable
    scrollbar-width none
    mask-image linear-gradient(to bottom, transparent, #000 30px, #000, #000 calc(100% - 30px), transparent), linear-gradient(to left, black, transparent 50px)
    mask-size 100% 100%
    mask-position 0 0, 100% 0
    mask-repeat no-repeat, no-repeat

    &::-webkit-scrollbar
      width 12px
      height 12px

    &::-webkit-scrollbar-track
      margin 0
      background #545454

    &::-webkit-scrollbar-thumb
      background #c1c8d2

    .add
      display flex
      flex-direction column
      justify-content center
      align-items center
      // overflow hidden
      box-sizing border-box
      margin 10px
      width 387px
      height 650px
      border-bottom 15px solid #c3c3c3
      border-top-right-radius 50px
      background linear-gradient(to bottom, #373737, #615a6d)
      color #afafaf
      cursor pointer

      &:hover
        position relative
        filter brightness(1.1)

        &:after
          position absolute
          top 0
          right 0
          bottom -15px
          left 0
          border 5px solid rgba(255, 255, 255, 0.7)
          border-top-right-radius 50px
          content ''
          pointer-events none

.del
  position absolute
  top 0
  right 0
  display flex
  justify-content center
  align-items center
  width 80px
  height 80px
  font-size 50px
  opacity 0
  cursor pointer

  :deep(path)
    fill #fff

  &:hover
    opacity 1
</style>
