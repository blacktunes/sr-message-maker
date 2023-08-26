<template>
  <transition name="fade">
    <div
      class="character-select"
      v-show="input.select"
      @contextmenu.prevent.stop="hide"
    >
      <div
        class="box"
        @click.stop=""
      >
        <div class="list">
          <div class="title">游戏角色</div>
          <div class="character-list">
            <CharacterCard
              class="character"
              :custom="setting.type === 'custom'"
              :name="setting.name"
              :avatar="user[setting.type].card"
              :level="setting.type === 'custom' ? 5 : undefined"
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
          <div style="height: 30px"></div>
          <div class="title">其他角色</div>
          <div class="character-list">
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
          <div style="height: 30px"></div>
          <div class="title">自定义角色</div>
          <div class="character-list">
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
  </transition>
</template>

<script lang="ts" setup>
import { watch } from 'vue'
import { getAvatar } from '@/assets/scripts/avatar'
import { user } from '@/assets/data/characterData'
import { character } from '@/store/character'
import { input } from '@/store/input'
import { message } from '@/store/message'
import { setting } from '@/store/setting'
import CharacterCard from './Character/CharacterCard.vue'
import Icon from './Common/Icon.vue'
import { compressImage } from '@/assets/scripts/image'

watch(
  () => input.select,
  () => {
    if (!input.select) {
      input.index = undefined
    }
  }
)

const hide = () => {
  input.select = false
}

const handelcharacterClick = (key: string, name: string) => {
  if (input.index) {
    message.list[input.index[0]].list[input.index[1]].key = key
    message.list[input.index[0]].list[input.index[1]].name = name
    message.list[input.index[0]].list[input.index[1]].avatar = getAvatar(key)
  } else {
    input.character.key = key
    input.character.name = name
  }
  hide()
}

const addCustom = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = () => {
    if (input.files?.[0]) {
      compressImage(input.files[0], 500).then((avatar) => {
        const name = prompt('请输入角色名')
        if (!name) return
        const key = Date.now()
        const info = prompt('请输入角色签名') || ''
        character.custom[key] = {
          name,
          avatar,
          info,
          custom: true
        }
      })
    }
  }
  input.click()
}

const handelDelClick = (key: string, name: string) => {
  const flag = confirm(`是否删除该角色 - ${name}`)
  if (flag) delete character.custom[key]
}
</script>

<style lang="stylus" scoped>
@import './Common/Window.styl'

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

    .list
      overflow overlay
      width 100%
      height 100%
      padding 0 30px 0 20px
      margin 15px 0

      &::-webkit-scrollbar-track
        margin-top 120px

      .title
        z-index 9
        position sticky
        top 0
        font-size 60px
        font-weight bold
        margin 0 20px 25px 5px
        padding-bottom 20px
        background var(--box-background-color)
        box-shadow 0 -2px var(--box-background-color), 0 20px 10px -10px rgba(183, 183, 183, 0.8)

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
