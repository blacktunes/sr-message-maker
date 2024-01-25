<template>
  <Popup :index="props.index">
    <Window
      class="window"
      title="更换头像"
    >
      <div
        class="list"
        ref="listDom"
      >
        <div
          class="avatar"
          v-for="(item, key) in avatar.game"
          :key="key"
          :class="{ highlight: avatarData.index === key }"
          @click="onAvatarClick(key)"
        >
          <img
            :src="item.avatar"
            alt=""
          />
        </div>
        <div
          class="avatar"
          v-for="(url, key) in avatar.custom"
          :key="key"
          :class="{ highlight: avatarData.index === key }"
          @click="avatarData.index = key"
          @contextmenu.prevent.stop="handelDelClick(key)"
        >
          <img
            :src="url"
            alt=""
          />
          <div
            class="del"
            @click.stop="handelDelClick(key)"
          >
            <Icon
              name="delete"
              width="25"
              height="25"
            />
          </div>
        </div>
        <div
          class="add"
          title="上传头像"
          @click.stop="addCustom"
        >
          <Icon name="add" />
        </div>
      </div>
      <template #left>
        <Preview
          style="margin-top: 45px"
          :img="imgUrl"
          :name="name"
          width="350px"
          color="#333"
          bg-color="linear-gradient(to top, #bcb2a2, #cac2b7, transparent)"
          font-size="40px"
          title="切换为游戏角色"
          circle
          @click="changeTOGameCharacter"
        />
      </template>
      <template #footer>
        <Btn
          class="win-btn"
          name="取消"
          type="wrong"
          @click="close"
        />
        <Btn
          class="win-btn"
          name="确认"
          type="check"
          :disable="avatarData.index === setting.avatar"
          @click="onBtnClick"
        />
      </template>
    </Window>
  </Popup>
</template>

<script lang="ts" setup>
import Popup from '@/components/Common/Popup.vue'
import Window from '@/components/Common/Window.vue'
import Btn from '@/components/Common/Btn.vue'
import Icon from '@/components/Common/Icon.vue'
import Preview from '@/components/Common/Preview.vue'
import borderUrl from '@/assets/images/avatar/边框.webp'
import iconUrl from '@/assets/images/avatar/图标.webp'
import defaultAvatar from '@/assets/images/avatar/私聊.webp'
import { watch, ref, computed, nextTick } from 'vue'
import { setAvatar, setName, setting } from '@/store/setting'
import { character } from '@/store/character'
import { getAssets } from '@/assets/scripts/preload'
import { avatar } from '@/store/avatar'
import { enterCallback, openWindow } from '@/assets/scripts/popup'
import { avatarData } from './'

const listDom = ref<HTMLElement | null>(null)

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

watch(
  () => props.index,
  () => {
    if (props.index !== -1) {
      if (
        (typeof setting.avatar === 'string' &&
          !avatar.game[setting.avatar] &&
          !character.game[setting.avatar] &&
          !character.other[setting.avatar] &&
          !character.custom[setting.avatar]) ||
        (typeof setting.avatar === 'number' && !avatar.custom[setting.avatar])
      ) {
        setAvatar()
      }
      avatarData.index = setting.avatar

      nextTick(() => {
        if (listDom.value) {
          listDom.value.querySelector('.highlight')?.scrollIntoView({
            block: 'center'
          })
        }
      })
    } else {
      avatarData.name = undefined
    }
  },
  {
    immediate: true
  }
)

const imgUrl = computed(() => {
  if (typeof avatarData.index === 'string') {
    if (avatar.game[avatarData.index]) {
      return avatar.game[avatarData.index].avatar
    }
    if (character.game[avatarData.index]) {
      return character.game[avatarData.index].avatar
    }
    if (character.other[avatarData.index]) {
      return character.other[avatarData.index].avatar
    }
    if (character.custom[avatarData.index]) {
      return character.custom[avatarData.index].avatar || defaultAvatar
    }
  }
  if (typeof avatarData.index === 'number') {
    return avatar.custom[avatarData.index]
  }
  return ''
})

const handelDelClick = (key: number) => {
  openWindow('confirm', {
    title: '删除头像',
    text: ['是否删除该头像'],
    fn: () => {
      avatar.custom.splice(key, 1)
      if (key === setting.avatar) {
        avatarData.index = DEFAULT_AVATAR
        setAvatar(avatarData.index)
      } else if (key === avatarData.index) {
        avatarData.index = DEFAULT_AVATAR
      }
    }
  })
}

const addCustom = () => {
  openWindow('cropper', {
    aspectRatio: 1,
    maxWidth: 500
  }).then(({ base64 }) => {
    avatar.custom.push(base64)
  })
}

const name = computed(() => {
  if (typeof avatarData.index === 'string' && !Number(avatarData.index)) {
    return avatarData.index
  }
  return ''
})

const onAvatarClick = (key: string | number) => {
  avatarData.name = undefined
  avatarData.index = key
}

const onBtnClick = () => {
  if (setting.avatar === avatarData.index) return false
  close()
  if (avatarData.name) {
    setName(avatarData.name)
  }
  setAvatar(avatarData.index)
  return true
}

enterCallback[props.name] = onBtnClick

const changeTOGameCharacter = () => {
  openWindow('character', [-1, -1])
}

const border = computed(() => `url('${getAssets(borderUrl).value}`)
const icon = computed(() => `url('${getAssets(iconUrl).value}`)
</script>

<style lang="stylus" scoped>
.window
  :deep(.item)
    margin 10px 80px !important
    max-height unset !important

  :deep(.img_circle)
    &:hover
      filter brightness(1.05)

  :deep(.content)
    mask-image linear-gradient(to bottom, #000 calc(100% - 60px), transparent), linear-gradient(to left, black, transparent 50px) !important

.list
  $border-width = 4px
  display flex
  flex-wrap wrap
  justify-content flex-start
  overflow-x hidden
  height 520px
  width 1200px
  padding-bottom 40px
  user-select none

  .avatar, .add
    box-sizing border-box
    width 190px
    height 190px
    border-radius 50%
    margin 30px 25px 5px 15px
    border $border-width solid transparent

    &:hover
      filter brightness(1.05)

  .avatar
    display flex
    align-items center
    justify-content center
    position relative
    cursor pointer

    &:hover
      .del
        opacity 1

    img
      width 190px - $border-width * 2
      height 190px - $border-width * 2
      object-fit contain
      border-radius 50%
      background #c3b7a9
      user-select none
      pointer-events none

    .del
      position absolute
      right -20px
      top -20px
      opacity 0
      cursor pointer

      &:hover
        opacity 1

  .add
    display flex
    align-items center
    justify-content center
    border 8px solid #afafaf
    cursor pointer

.highlight
  cursor auto !important
  border-color #fff !important

  &:hover
    filter none !important

  &:before
    content ''
    position absolute
    left 50%
    bottom 50%
    height 130%
    width 130%
    border-radius 50%
    transform translate(-50%, 50%)
    background v-bind(border)
    background-size 100%
    animation highlight-rotate 30s linear infinite
    pointer-events none

  &:after
    content ''
    position absolute
    left 50%
    top -60px
    height 45px
    width 40px
    transform translate(-50%, 55%)
    background v-bind(icon)
    background-size 100%
    background-repeat no-repeat
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
