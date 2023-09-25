<template>
  <window
    title="更新记录"
    width="40%"
    :show="popup.log"
    @close="popup.log = false"
  >
    <div
      class="item"
      :class="{
        highlight: index === 0
      }"
      v-for="(item, index) in changeLog"
      :key="`time-${index}`"
    >
      <div class="time">{{ item.time }}</div>
      <div
        class="text"
        v-for="(text, key) in item.text"
        :key="`text-${index}-${key}`"
      >
        {{ text.text }}
        <template v-if="text.author">
          <a
            target="_blank"
            :href="text.url"
            >@{{ text.author }}</a
          >
        </template>
        <template v-if="text.info">
          <div class="info">{{ text.info }}</div>
        </template>
      </div>
    </div>
  </window>
</template>

<script lang="ts" setup>
import Window from '@/components/Common/Window.vue'
import { popup } from '@/store/popup'
import log from '@/assets/data/log.json'

const changeLog: {
  time: string
  text: {
    text: string
    info?: string
    author?: string
    url?: string
  }[]
}[] = log

const checkUpdate = () => {
  const lastUpdate = new Date(changeLog[0].time).getTime()
  const localLastUpdate = Number(localStorage.getItem('sr-message-time'))
  if (lastUpdate) {
    if (lastUpdate <= localLastUpdate) return
  }
  popup.log = true
  localStorage.setItem('sr-message-time', JSON.stringify(lastUpdate))
}
checkUpdate()
</script>

<style lang="stylus" scoped>
.item
  margin 20px 20px 20px 0
  padding 10px 20px 20px 10px

  .time
    font-size 46px
    font-weight bold

  .text
    font-size 36px
    margin-top 5px

    a
      font-weight bold
      color #1F2328
      text-decoration none

      &:hover
        text-decoration underline

    .info
      font-size 32px
      color #666

.highlight
  background #ccc
  border-radius 5px
</style>
