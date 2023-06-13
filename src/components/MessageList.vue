<template>
  <div class="list-wrapper">
    <div class="item-list">
      <ListItem
        v-for="(item, index) in list"
        :key="index"
        :title="item.title"
        :list="item.list"
      />
    </div>
    <div class="btn-list"></div>
  </div>
</template>

<script lang="ts" setup>
import { message } from '@/store/message'
import { computed } from 'vue'
import ListItem from './Sub/ListItem.vue'
import { setting } from '@/store/setting'

const list = computed(() => {
  const temp: {
    time: number
    title: string
    list: MessageItem[]
  }[] = []
  message.list.forEach(item => {
    const name: string[] = []
    for (const _message of item.list) {
      if (_message.key !== '开拓者' && !name.includes(_message.key)) {
        name.push(_message.key)
      }
    }

    if (name.length > 1) {
      const title = item.title || `${name.join('、')}、${setting.name}的群聊`
      const index = temp.findIndex(item2 => item2.title === title)
      if (index !== -1) {
        temp[index].list.unshift(item)
        temp[index].time = Math.max(temp[index].time, item.time)
        temp[index].list.sort((a, b) => b.time - a.time)
      } else {
        temp.unshift({
          title,
          time: item.time,
          list: [item]
        })
      }
    } else {
      const index = temp.findIndex(item2 => item2.title === name[0])
      if (index !== -1) {
        temp[index].list.unshift(item)
        temp[index].time = Math.max(temp[index].time, item.time)
        temp[index].list.sort((a, b) => b.time - a.time)
      } else {
        temp.unshift({
          title: item.title || name[0],
          time: item.time,
          list: [item]
        })
      }
    }
  })

  temp.sort((a, b) => b.time - a.time)

  return temp
})
</script>

<style lang="stylus">
$pos = 190px

.list-wrapper
  position absolute
  top $pos
  left $pos
  width 750px
  height 'calc(100% - %s)' % $pos

  .item-list
    overflow-y scroll
    overflow-x hidden
    width 100%
    height calc(100% - 225px)

    &::-webkit-scrollbar
      width 0
      height 0

  .btn-list
    display flex
    align-items flex-start
    box-sizing border-box
    width 100%
    height 225px
    border-top 5px solid #595556
    padding-top 35px
</style>
