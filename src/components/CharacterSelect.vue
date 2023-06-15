<template>
  <div class="character-select" v-show="input.select">
    <div class="box" @click.stop="">
      <div class="list">
        <div class="title">游戏角色</div>
        <div class="item">
          <div
            class="character"
            v-for="(item, key) in character.game"
            :key="`avatar-${key}`"
            :title="`${item.name}`"
            @click="handelcharacterClick(String(key))"
          >
            <div class="avatar">
              <img :src="item.card" :alt="item.name" draggable="false" />
              <div class="name">{{ item.name }}</div>
            </div>
            <div class="info" :title="item.info">
              {{ item.info || "" }}
            </div>
          </div>
        </div>
        <div style="height: 30px"></div>
        <div class="title">自定义角色</div>
        <div class="item">
          <div
            class="character"
            v-for="(item, key) in character.custom"
            :key="`avatar-${key}`"
            @click="handelcharacterClick(String(key))"
          >
            <div class="avatar" style="height: 'var(--character-item-width)'">
              <img
                :src="item.avatar"
                :alt="item.name"
                :title="item.name"
                draggable="false"
              />
            </div>
            <div style="font-size: 40px">{{ item.name }}</div>
            <div class="info">{{ item.info || "" }}</div>
            <div class="del" @click.stop="handelDelClick(String(key))">×</div>
          </div>
          <div class="add" @click="addCustom">
            <svg
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              width="150"
              height="150"
            >
              <path
                d="M874.666667 469.333333H554.666667V149.333333c0-23.466667-19.2-42.666667-42.666667-42.666666s-42.666667 19.2-42.666667 42.666666v320H149.333333c-23.466667 0-42.666667 19.2-42.666666 42.666667s19.2 42.666667 42.666666 42.666667h320v320c0 23.466667 19.2 42.666667 42.666667 42.666666s42.666667-19.2 42.666667-42.666666V554.666667h320c23.466667 0 42.666667-19.2 42.666666-42.666667s-19.2-42.666667-42.666666-42.666667z"
                fill="#afafaf"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getAvatar } from '@/assets/scripts/avatar'
import { character } from '@/store/character'
import { input } from '@/store/input'
import { message } from '@/store/message'

const hide = () => {
  input.select = false
}

const handelcharacterClick = (key: string) => {
  if (input.index) {
    message.list[input.index[0]].list[input.index[1]].key = key
    message.list[input.index[0]].list[input.index[1]].name = key
    message.list[input.index[0]].list[input.index[1]].avatar = getAvatar(key)
    input.index = undefined
  } else {
    input.character = key
  }
  hide()
}

const addCustom = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = () => {
    if (input.files?.[0]) {
      const file = new FileReader()
      file.readAsDataURL(input.files[0])
      file.onload = e => {
        const avatar = e.target?.result as string || ''
        const name = prompt('请输入角色名')
        if (name === null) return
        if (character.custom[name]) {
          alert('角色已存在')
          return
        }
        const info = prompt('请输入角色签名') || ''
        character.custom[name] = {
          name,
          avatar,
          info,
          custom: true
        }
      }
    }
  }
  input.click()
}

const handelDelClick = (key: string) => {
  delete character.custom[key]
}
</script>

<style lang="stylus" scoped>
.character-select
  --character-item-width 387px
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
    display flex
    flex-direction column
    justify-content center
    align-items center
    width 90%
    height 90%
    padding 20px 50px 20px 40px
    background #d5d5d5
    box-shadow 0 0 20px 5px rgba(0, 0, 0, 0.3)
    cursor default
    border-top-right-radius 20px

    .list
      overflow overlay
      width 100%
      height 100%
      padding 10px 30px 10px 20px

      .title
        font-size 60px
        font-weight bold
        margin-bottom 25px
        padding-bottom 20px
        border-bottom 1px solid

      .item
        display flex
        flex-wrap wrap

        .character
          position relative
          margin 10px
          width var(--character-item-width)
          cursor pointer

          .avatar
            position relative

            img
              width 100%

          .name, .info
            width 100%
            overflow hidden
            white-space nowrap
            text-overflow ellipsis

          .name
            position absolute
            bottom 80px
            color rgba(255, 255, 255, 0.85)
            font-weight bold
            font-size 40px
            text-align center

          .info
            font-size 30px
            color #6a6a6a
            text-align center

          &:hover
            .del
              opacity 1

        .add
          box-sizing border-box
          width var(--character-item-width)
          height var(--character-item-width)
          margin 10px
          display flex
          justify-content center
          align-items center
          flex-direction column
          border 5px solid #afafaf
          cursor pointer

.del
  display flex
  align-items center
  justify-content center
  position absolute
  right 0
  bottom 25px
  width 80px
  height 80px
  font-size 50px
  opacity 0
  cursor pointer

  &:hover
    opacity 1
</style>
