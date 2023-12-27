<template>
  <Window
    style="z-index: 90"
    :show="popup.setting"
    title="更换对话框"
  >
    <div class="select">
      <div
        class="item"
        v-for="(item, key) in bubbles"
        :key="key"
        :class="{ highlight: index === key }"
        @click="index = key"
      >
        <img
          :src="item.img"
          :alt="item.name"
        />
      </div>
    </div>
    <template #outside>
      <div class="other-setting">
        <div
          class="setting-btn"
          title="更新记录"
          @click.stop="openWindow('log')"
        >
          <Icon
            name="log"
            width="50"
            height="50"
          />
        </div>
        <div
          class="setting-btn"
          title="字体设置"
          @click.stop="openWindow('font')"
        >
          <Icon
            name="font"
            width="60"
            height="60"
          />
        </div>
        <div
          class="setting-btn"
          title="数据管理"
          @click.stop="openWindow('data')"
        >
          <Icon name="data" />
        </div>
      </div>
    </template>
    <template #left>
      <Preview
        :img="bubbles[index].preview"
        :name="name"
      />
    </template>
    <template #footer>
      <Btn
        class="win-btn"
        name="取消"
        type="wrong"
        @click="popup.setting = false"
      />
      <Btn
        class="win-btn"
        name="确认"
        type="check"
        :disable="index === setting.bubbles"
        @click="onBtnClick"
      />
    </template>
  </Window>
</template>

<script lang="ts" setup>
import { watch, ref, computed } from 'vue'
import { bubbles } from '@/assets/data/bubbles'
import { setting } from '@/store/setting'
import { openWindow, popup, popupCallbalk } from '@/store/popup'
import Window from '@/components/Common/Window.vue'
import Btn from '@/components/Common/Btn.vue'
import Icon from '@/components/Common/Icon.vue'
import Preview from '@/components/Common/Preview.vue'

const index = ref(0)

const nameList = ['次元扑满', '扑满', '泡泡', '毛球', '白色恶魔', '肥大', '扑满侠', '扑神']
const name = computed(() => {
  if (index.value === 2) {
    return nameList[Math.floor(Math.random() * nameList.length)]
  } else {
    return bubbles[index.value].name
  }
})

watch(
  () => popup.setting,
  () => {
    if (popup.setting) {
      index.value = setting.bubbles
    }
  }
)

const onBtnClick = () => {
  if (setting.bubbles === index.value) return false
  popup.setting = false
  setting.bubbles = index.value
  localStorage.setItem('sr-message-bubbles', JSON.stringify(setting.bubbles))
  return true
}

popupCallbalk.setting = onBtnClick
</script>

<style lang="stylus" scoped>
.other-setting
  .setting-btn
    box-sizing border-box
    width 90px
    height 90px
    display flex
    justify-content center
    align-items center
    background rgba(255, 255, 255, 0.8)
    border-radius 50%
    border 5px solid #767479
    margin-bottom 30px
    cursor pointer

    :deep(path)
      fill #767479

    &:hover
      background #ffffff

.select
  display flex
  flex-wrap wrap
  justify-content flex-start
  overflow-x hidden
  height 450px
  width 1200px
  margin-bottom 30px
  padding-right 10px
  user-select none

  .item
    display flex
    justify-content center
    align-items center
    overflow hidden
    position relative
    box-sizing border-box
    width 385px
    height 200px
    margin 30px 10px 0 0
    background #c5c6ca
    border 4px solid #a7a8aa
    cursor pointer

    &:hover
      background #d7d7d7

    img
      width 100%

.highlight
  border 4px solid #14120d !important
  cursor auto !important

  &:after
    content '使用中'
    position absolute
    left 0
    bottom 0
    display flex
    justify-content center
    align-items center
    background #e7c57e
    height 38px
    width 100%
    font-size 28px

  &:hover
    background #c5c6ca !important
</style>
