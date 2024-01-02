<template>
  <Window
    class="window"
    style="z-index: 90"
    :show="popup.avatar"
    title="更换头像"
  >
    <div
      class="list"
      ref="listDom"
    >
      <div
        class="avatar"
        v-for="(item, key) in character.avatar"
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
        v-for="(url, key) in character.customAvatar"
        :key="key"
        :class="{ highlight: avatarData.index === key }"
        @click="avatarData.index = key"
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
        @click="popup.avatar = false"
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
</template>

<script lang="ts" setup>
import Window from '@/components/Common/Window.vue'
import Btn from '@/components/Common/Btn.vue'
import Icon from '@/components/Common/Icon.vue'
import Preview from '@/components/Common/Preview.vue'
import borderUrl from '@/assets/images/avatar/边框.webp'
import iconUrl from '@/assets/images/avatar/图标.webp'
import defaultAvatar from '@/assets/images/avatar/私聊.webp'
import { watch, ref, computed, nextTick } from 'vue'
import { setAvatar, setName, setting } from '@/store/setting'
import { popup, popupCallbalk, avatarData } from '@/store/popup'
import { cropperOpen } from '@/store/cropper'
import { showConfirm } from '@/store/popup'
import { input } from '@/store/input'
import { character } from '@/store/character'
import { getAssets } from '@/assets/scripts/preload'
import { compressImage } from '@/assets/scripts/image'

const listDom = ref<HTMLElement | null>(null)

watch(
  () => popup.avatar,
  () => {
    if (popup.avatar) {
      if (
        (typeof setting.avatar === 'string' &&
          !character.avatar[setting.avatar] &&
          !character.game[setting.avatar] &&
          !character.other[setting.avatar] &&
          !character.custom[setting.avatar]) ||
        (typeof setting.avatar === 'number' && !character.customAvatar[setting.avatar])
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
    if (character.avatar[avatarData.index]) {
      return character.avatar[avatarData.index].avatar
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
    return character.customAvatar[avatarData.index]
  }
  return ''
})

const handelDelClick = (key: number) => {
  showConfirm({
    title: '删除头像',
    text: ['是否删除该头像'],
    fn: () => {
      character.customAvatar.splice(key, 1)
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
  const el = document.createElement('input')
  el.type = 'file'
  el.accept = 'image/*'
  el.onchange = async () => {
    if (el.files?.[0]) {
      const avatar = await compressImage(el.files[0])
      cropperOpen(
        avatar,
        (res) => {
          character.customAvatar.push(res)
        },
        {
          aspectRatio: 1,
          maxWidth: 500
        }
      )
    }
  }
  el.click()
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
  popup.avatar = false
  if (avatarData.name) {
    setName(avatarData.name)
  }
  setAvatar(avatarData.index)
  return true
}

popupCallbalk.avatar = onBtnClick

const changeTOGameCharacter = () => {
  input.index = [-1, -1]
  input.select = true
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

.list
  display flex
  flex-wrap wrap
  justify-content flex-start
  overflow-x hidden
  height 500px
  width 1200px
  padding-bottom 60px
  user-select none

  .avatar, .add
    box-sizing border-box
    width 190px
    height 190px
    border-radius 50%
    margin 40px 30px 10px 10px

    &:hover
      filter brightness(1.05)

  .avatar
    position relative
    background #c3b7a9
    cursor pointer

    &:hover
      .del
        opacity 1

    img
      width 100%
      height 100%
      object-fit contain
      border-radius 50%
      clip-path var(--avatar-image-clip-path-bilibiliwiki-only)
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

  &:after
    content ''
    position absolute
    left 50%
    bottom 50%
    height 120%
    width 120%
    border-radius 50%
    transform translate(-50%, 50%)
    background v-bind(border)
    background-size 100%
    animation highlight-rotate 30s linear infinite

  &:before
    content ''
    position absolute
    left 50%
    top -70px
    height 30%
    width 25%
    transform translate(-50%, 50%)
    background v-bind(icon)
    background-size 100%
    background-repeat no-repeat
    animation highlight-icon 0.5s linear alternate infinite

@keyframes highlight-rotate
  from
    transform translate(-50%, 50%) rotate(0deg)

  to
    transform translate(-50%, 50%) rotate(-360deg)

@keyframes highlight-icon
  from
    top -70px

  to
    top -75px
</style>
