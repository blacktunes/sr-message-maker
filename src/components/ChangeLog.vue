<template>
  <transition name="fade">
    <window
      title="更新记录"
      width="40%"
      v-if="setting.log"
      @close="setting.log = false"
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
            (<a :href="text.url">{{ text.author }}</a
            >)
          </template>
        </div>
      </div>
    </window>
  </transition>
</template>

<script lang="ts" setup>
import { setting } from '@/store/setting'
import Window from './Common/Window.vue'

const changeLog: {
  time: string
  text: {
    text: string
    author?: string
    url?: string
  }[]
}[] = [
  {
    time: '2023-08-11',
    text: [{ text: '完善字体修改功能' }, { text: '优化界面' }]
  },
  {
    time: '2023-08-06',
    text: [{ text: '增加新角色(卡芙卡、卢卡)' }, { text: '增加开拓任务和日常任务消息' }]
  },
  {
    time: '2023-08-06',
    text: [
      { text: '修复部分浏览器无法下载图片和排版错误' },
      { text: '增加删除短信和自定义角色的确认' },
      { text: '修复滚动提示不会自动消失' }
    ]
  },
  {
    time: '2023-07-31',
    text: [
      { text: '增加新角色(刃)' },
      { text: '增加新的帕姆表情' },
      { text: '修复滚动提示不会自动消失' }
    ]
  },
  {
    time: '2023-07-16',
    text: [
      { text: '修复头像边框问题', author: 'conglinyizhi', url: 'https://github.com/conglinyizhi' }
    ]
  },
  {
    time: '2023-07-16',
    text: [{ text: '增加回复选项' }]
  },
  {
    time: '2023-07-13',
    text: [{ text: '增加任务消息' }]
  },
  {
    time: '2023-07-11',
    text: [
      { text: '增加根据回复长度决定消息加载动画时长' },
      { text: '增加消息滚动提示' },
      { text: '修复新消息不会自动展开分组' }
    ]
  },
  {
    time: '2023-07-10',
    text: [
      { text: '修复自定义角色重名导致的角色错误' },
      { text: '修复标题无法修改' },
      { text: '修复新消息不会自动展开分组' }
    ]
  },
  {
    time: '2023-07-07',
    text: [{ text: '增加菜单细节' }]
  },
  {
    time: '2023-07-03',
    text: [{ text: '增加新角色(罗刹、驭空)' }]
  },
  {
    time: '2023-06-22',
    text: [{ text: '增加加载动画' }, { text: '增加修改字体功能' }, { text: '增加自定义头像功能' }]
  },
  {
    time: '2023-06-19',
    text: [{ text: '增加男女主切换' }]
  },
  {
    time: '2023-06-13',
    text: [{ text: '优化角色选择组件' }, { text: '增加表情包功能' }]
  },
  {
    time: '2023-05-29',
    text: [{ text: '增加横屏提示' }, { text: '增加自动播放功能' }, { text: '优化菜单按钮' }]
  },
  {
    time: '2023-05-14',
    text: [{ text: '增加修改已发送图片' }]
  },
  {
    time: '2023-05-04',
    text: [
      { text: '增加自定义角色' },
      { text: '增加通知消息' },
      { text: '修复拖拽排序导致的样式异常' },
      { text: '增加彩蛋' }
    ]
  },
  {
    time: '2023-04-28',
    text: [{ text: '增加消息拖拽排序' }]
  },
  {
    time: '2023-04-26',
    text: [{ text: '初版上线' }]
  }
]

const checkUpdate = () => {
  const lastUpdate = new Date(changeLog[0].time).getTime()
  const localLastUpdate = Number(localStorage.getItem('sr-message-time'))
  if (lastUpdate) {
    if (lastUpdate <= localLastUpdate) return
  }
  setting.log = true
  localStorage.setItem('sr-message-time', JSON.stringify(lastUpdate))
}
checkUpdate()
</script>

<style lang="stylus" scoped>
.item
  margin 30px 20px 30px 0
  padding 10px

  .time
    font-size 46px
    font-weight bold
    margin-bottom 10px

  .text
    font-size 36px

.highlight
  background #bbb
  border-radius 5px
</style>
