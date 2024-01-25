<template>
  <Popup
    :index="props.index"
    show
  >
    <div
      class="character-select"
      @contextmenu.prevent.stop="close"
    >
      <div
        class="box"
        @click.stop=""
      >
        <div class="tabs">
          <div
            class="tab"
            :class="{ highlight: page === 0 }"
            @click="changePage(0)"
          >
            游戏角色
          </div>
          <div
            class="tab"
            :class="{ highlight: page === 1 }"
            @click="changePage(1)"
          >
            其它角色
          </div>
          <div
            class="tab"
            :class="{ highlight: page === 2 }"
            @click="changePage(2)"
          >
            自定义角色
          </div>
        </div>
        <div class="list">
          <div
            class="character-list"
            data-type="game"
            ref="game"
          >
            <CharacterCard
              class="character"
              :custom="!userData.card"
              :name="setting.name"
              :avatar="userData.card || userData.avatar"
              :level="!userData.card ? 5 : undefined"
              title="开拓者"
              @click="handelcharacterClick('开拓者', '')"
            />
            <CharacterCard
              v-for="(item, key) in character.game"
              :key="`character-${key}`"
              class="character"
              :name="item.name"
              :info="item.info"
              :avatar="item.card"
              @click="handelcharacterClick(String(key), item.name)"
            />
          </div>
          <div
            class="character-list"
            data-type="other"
            ref="other"
          >
            <CharacterCard
              v-for="(item, key) in character.other"
              :key="`other-character-${key}`"
              class="character"
              :custom="true"
              :name="item.name"
              :info="item.info"
              :avatar="item.avatar"
              :level="item.gold ? 5 : undefined"
              @click="handelcharacterClick(String(key), item.name)"
            />
          </div>

          <div
            class="character-list"
            data-type="custom"
            ref="custom"
          >
            <CharacterCard
              v-for="(item, key) in character.custom"
              :key="`custom-character-${key}`"
              class="character"
              :custom="true"
              :name="item.name"
              :info="item.info"
              :avatar="item.avatar"
              @click="handelcharacterClick(String(key), item.name)"
              @contextmenu.prevent.stop="handelDelClick(String(key), item.name)"
            >
              <div
                class="del"
                @click.stop="handelDelClick(String(key), item.name)"
              >
                <Icon
                  name="delete"
                  width="25"
                  height="25"
                />
              </div>
            </CharacterCard>
            <div
              class="add"
              @click="addCustom"
            >
              <Icon name="add" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </Popup>
</template>

<script lang="ts" setup>
import Popup from '@/components/Common/Popup.vue'
import CharacterCard from '@/components/Character/CharacterCard.vue'
import Icon from '@/components/Common/Icon.vue'
import { avatarData } from '@/components/Popup/Avatar'
import { onMounted, ref } from 'vue'
import { getCharaterAvatar } from '@/assets/scripts/avatar'
import { character } from '@/store/character'
import { userData } from '@/store/avatar'
import { input } from '@/store/input'
import { message } from '@/store/message'
import { setting } from '@/store/setting'
import { openWindow } from '@/assets/scripts/popup'
import { characterData } from './'

const game = ref<HTMLElement | null>(null)
const other = ref<HTMLElement | null>(null)
const custom = ref<HTMLElement | null>(null)

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

const page = ref(0)

const intersectionRatio: [number, number, number] = [0, 0, 0]

const intersectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((item) => {
    switch ((item.target as HTMLElement).dataset.type) {
      case 'game':
        intersectionRatio[0] = item.intersectionRatio
        break
      case 'other':
        intersectionRatio[1] = item.intersectionRatio
        break
      case 'custom':
        intersectionRatio[2] = item.intersectionRatio
        break
    }
  })

  if (intersectionRatio[2] > 0) {
    page.value = 2
    return
  }
  if (intersectionRatio[1] > 0) {
    page.value = 1
    return
  }
  page.value = 0
})

onMounted(() => {
  if (game.value) intersectionObserver.observe(game.value)
  if (other.value) intersectionObserver.observe(other.value)
  if (custom.value) intersectionObserver.observe(custom.value)
})

const changePage = (page: number) => {
  if (page === 0) {
    game.value?.scrollIntoView({
      behavior: 'smooth'
    })
    return
  }

  if (page === 1) {
    other.value?.scrollIntoView({
      behavior: 'smooth'
    })
    return
  }

  if (page === 2) {
    custom.value?.scrollIntoView({
      behavior: 'smooth'
    })
    return
  }
}

const handelcharacterClick = (key: string, name: string) => {
  if (characterData.key) {
    if (characterData.key[0] === -1) {
      if (key !== '开拓者') {
        avatarData.index = key
        avatarData.name = name
      } else {
        avatarData.index = setting.avatar
        avatarData.name = setting.name
      }
    } else {
      message.list[characterData.key[0]].list[characterData.key[1]].key = key
      message.list[characterData.key[0]].list[characterData.key[1]].name = name
      message.list[characterData.key[0]].list[characterData.key[1]].avatar = getCharaterAvatar(key)
    }
  } else {
    input.character.key = key
    input.character.name = name
  }
  close()
}

const addCustom = async () => {
  const name: string = await openWindow('input', { title: '请输入角色名' })
  if (!name) return

  const info = await openWindow('input', {
    title: '请输入角色签名',
    tip: '非必要选项',
    required: false
  })
  const key = Date.now()

  setTimeout(() => {
    openWindow('cropper', {
      aspectRatio: 1,
      maxWidth: 500
    }).then(({ base64 }) => {
      character.custom[key] = {
        name,
        avatar: base64,
        info,
        custom: true
      }
    })
  })
}

const handelDelClick = (key: string, name: string) => {
  openWindow('confirm', {
    title: '删除角色',
    text: [`是否删除${name}？`],
    fn: () => {
      delete character.custom[key]
    }
  })
}
</script>

<style lang="stylus" scoped>
@import '../../Common/Window.styl'

$character-item-width = 387px

.character-select
  z-index 99
  display flex
  justify-content center
  align-items center
  position absolute
  top 0
  left 0
  width 100%
  height 100%
  user-select none

  .box
    position relative
    display flex
    flex-direction column
    justify-content center
    align-items center
    width 90%
    height 90%
    padding 20px 65px
    background var(--box-background-color)
    cursor default
    message()

    .tabs
      display flex
      align-self flex-start
      width 100%

      .tab
        font-size 60px
        font-weight bold
        margin 0 20px 25px 5px
        opacity 0.5
        cursor pointer

        &:hover
          opacity 1

    .list
      overflow overlay
      width 100%
      height 100%
      padding 0 30px 0 20px
      margin 15px 0

      .character-list
        display flex
        flex-wrap wrap

        .character
          width $character-item-width

          &:hover
            .del
              opacity 1

        .add
          box-sizing border-box
          width $character-item-width
          height 645px
          margin 10px
          display flex
          justify-content center
          align-items center
          flex-direction column
          border 5px solid #afafaf
          cursor pointer

.highlight
  opacity 1 !important
  position relative

  &:after
    content ''
    position absolute
    left 0
    bottom -10px
    width 100%
    height 5px
    background #121212
    animation open 0.3s forwards

.del
  display flex
  align-items center
  justify-content center
  position absolute
  right 0
  top 0
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
