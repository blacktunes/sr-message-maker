<template>
  <Popup
    :index="props.index"
    show
  >
    <Window
      class="window"
      title="更换头像"
    >
      <div class="list">
        <div
          class="avatar-wrapper"
          v-for="(item, key) in avatar.game"
          :key="key"
        >
          <div
            class="avatar"
            :class="{ avatar_highlight: data.index === key }"
            @click="onAvatarClick(key)"
          >
            <img
              :src="item.avatar"
              alt=""
            />
          </div>
        </div>
        <div
          class="avatar-wrapper"
          v-for="(url, key) in avatar.custom"
          :key="key"
        >
          <div
            class="avatar"
            :class="{ avatar_highlight: data.index === key }"
            @click="data.index = key"
            @contextmenu.prevent.stop="handleDelClick(key)"
          >
            <img
              :src="url"
              alt=""
            />
            <div
              class="del"
              @click.stop="handleDelClick(key)"
            >
              <Icon
                name="delete"
                width="25"
                height="25"
              />
            </div>
          </div>
        </div>
        <div class="avatar-wrapper">
          <div
            class="btn"
            :class="{ avatar_highlight: isGameCharacter }"
            title="切换为游戏角色"
            @click.stop="changeToGameCharacter"
          >
            <Icon name="character" />
            <div class="border"></div>
          </div>
        </div>
        <div class="avatar-wrapper">
          <div
            class="btn"
            title="上传头像"
            @click.stop="addCustom"
          >
            <Icon name="add" />
            <div class="border"></div>
          </div>
        </div>
      </div>
      <template #left>
        <Preview
          style="margin-top: 45px"
          :img="imgUrl"
          :name="avatarName"
          width="350px"
          color="#333"
          bg-color="linear-gradient(to top, #bcb2a2, #cac2b7, transparent)"
          font-size="40px"
          title="切换为游戏角色"
          circle
        />
      </template>
      <template #footer>
        <Btn
          name="取消"
          type="wrong"
          @click="close"
        />
        <Btn
          name="确认"
          type="check"
          :disable="data.index === setting.avatar"
          @click="onConfirmClick"
        />
      </template>
    </Window>
  </Popup>
</template>

<script lang="ts" setup>
import defaultAvatar from '@/assets/images/avatar/私聊.webp'
import { popupManager } from '@/assets/scripts/popup'
import Icon from '@/components/Common/Icon.vue'
import Preview from '@/components/Common/Preview.vue'
import { avatar } from '@/store/avatar'
import { character } from '@/store/character'
import { setAvatar, setName, setting } from '@/store/setting'
import { Btn, Popup, Window } from 'star-rail-vue'
import { callback, data } from './data'

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

const isGameCharacter = computed(
  () => character.game[data.index] || character.other[data.index] || character.custom[data.index]
)

const avatarName = computed(() => {
  if (typeof data.index === 'string' && !Number(data.index)) {
    if (data.index.startsWith('开拓者•星轨')) {
      return `${setting.name}•星轨`
    }
    if (data.index.startsWith('星•') || data.index.startsWith('穹•')) {
      return data.index.replace(/星|穹/, setting.name)
    }
    return data.index
  }
  return ''
})

const imgUrl = computed(() => {
  if (typeof data.index === 'string') {
    if (avatar.game[data.index]) {
      return avatar.game[data.index].avatar
    }
    if (character.game[data.index]) {
      return character.game[data.index].avatar
    }
    if (character.other[data.index]) {
      return character.other[data.index].avatar
    }
    if (character.custom[data.index]) {
      return character.custom[data.index].avatar || defaultAvatar
    }
  }
  if (typeof data.index === 'number') {
    return avatar.custom[data.index]
  }
  return ''
})

const handleDelClick = (key: number) => {
  popupManager.open('confirm', {
    title: '删除头像',
    text: ['是否删除该头像'],
    fn: () => {
      avatar.custom.splice(key, 1)
      if (key === setting.avatar) {
        data.index = DEFAULT_AVATAR
        setAvatar(data.index)
      } else if (key === data.index) {
        data.index = DEFAULT_AVATAR
      }
    }
  })
}

const addCustom = () => {
  popupManager
    .open('cropper', {
      aspectRatio: 1,
      maxWidth: 500
    })
    .then(({ base64 }) => {
      avatar.custom.push(base64)
    })
}

const onAvatarClick = (key: string | number) => {
  data.name = undefined
  data.index = key
}

const onConfirmClick = () => {
  if (setting.avatar === data.index) return false
  if (data.name) {
    setName(data.name)
  }
  setAvatar(data.index)
  close()
  return true
}

callback.confirm = onConfirmClick

const changeToGameCharacter = () => {
  popupManager.open('character', [-1, -1])
}
</script>

<style lang="stylus" scoped>
.window
  :deep(.item)
    margin 10px 80px !important
    max-height unset !important

  :deep(.content)
    mask-image linear-gradient(to bottom, #000 calc(100% - 60px), transparent), linear-gradient(to left, black, transparent 50px) !important

$border-width = 4px

.list
  display flex
  flex-wrap wrap
  justify-content flex-start
  overflow-x hidden
  padding-bottom 40px
  width 1200px
  height 520px
  user-select none

  .avatar-wrapper
    overflow hidden
    margin-top -10px
    margin-left -10px
    width 235px
    height 235px

  .avatar
  .btn
    box-sizing border-box
    margin 25px
    width 190px
    height 190px
    border $border-width solid transparent
    border-radius 50%

    &:hover
      filter brightness(1.05)

  .avatar
    position relative
    display flex
    justify-content center
    align-items center
    cursor pointer

    &:hover
      .del
        opacity 1

    img
      width 190px - $border-width * 2
      height 190px - $border-width * 2
      border-radius 50%
      background #c3b7a9
      pointer-events none
      user-select none
      object-fit contain

    .del
      position absolute
      top -20px
      right -20px
      opacity 0
      cursor pointer

      &:hover
        opacity 1

  .btn
    position relative
    display flex
    justify-content center
    align-items center
    background #c3b7a9
    color #e4e5e4
    cursor pointer !important

    .border
      position absolute
      top 2px
      right 2px
      bottom 2px
      left 2px
      border 3px solid #e4e5e4
      border-radius 50%

.avatar_highlight
  border-color #fff !important
  cursor auto !important

  &:hover
    filter none !important

  &:before
    position absolute
    bottom 50%
    left 50%
    width 130%
    height 130%
    border-radius 50%
    background url('@/assets/images/avatar/边框.webp')
    background-size 100%
    content ''
    transform translate(-50%, 50%)
    animation highlight-rotate 30s linear infinite
    pointer-events none

  &:after
    position absolute
    top -60px
    left 50%
    width 40px
    height 45px
    background url('@/assets/images/avatar/图标.webp')
    background-size 100%
    background-repeat no-repeat
    content ''
    transform translate(-50%, 55%)
    animation highlight-icon 0.8s linear alternate infinite

@keyframes highlight-rotate
  from
    transform translate(-50%, 50%) rotate(0deg)

  to
    transform translate(-50%, 50%) rotate(360deg)

@keyframes highlight-icon
  from
    transform translate(-50%, 55%)

  to
    transform translate(-50%, 75%)
</style>
