<template>
  <template v-if="setting.index">
    <div class="message-wrapper">
      <div class="message-box" ref="messageDom">
        <div class="header">
          <div
            class="title"
            :contenteditable="names.length !== 1"
            @input="updateTitle($event)"
          >
            {{ title }}
          </div>
          <div class="info">{{ info }}</div>
        </div>
        <div class="message-list" ref="messageListDom">
          <draggable
            tag="transition-group"
            :component-data="{ name: 'list', type: 'transition' }"
            v-model="message.list[index].list"
            :item-key="(item: any) => 'message' + message.list[index].list.indexOf(item)"
          >
            <template
              #item="{ element, index }: { element: Message, index: number }"
            >
              <div v-if="element.notice" class="notice">
                <img src="@/assets/images/通知.png" alt="" />
                <span contenteditable @input="updateText($event, index)">
                  {{ element.text }}
                </span>
                <div>
                  <div @click="handelDelClick(index)">×</div>
                </div>
              </div>
              <div
                v-else
                class="message"
                :class="{
                  right: element.key === '开拓者',
                }"
              >
                <div class="avatar" @click="handelAvatarClick(index)">
                  <img :src="element.avatar" alt="" />
                </div>
                <div class="message-content">
                  <div class="name">
                    <span>
                      {{
                        element.key === "开拓者" ? setting.name : element.name
                      }}
                    </span>
                    <div class="del" @click="handelDelClick(index)">×</div>
                  </div>
                  <div class="img" v-if="element.img">
                    <img :src="element.img" alt="" />
                  </div>
                  <div
                    class="text"
                    v-else
                    contenteditable
                    @input="updateText($event, index)"
                  >
                    {{ element.text }}
                  </div>
                </div>
              </div>
            </template>
          </draggable>
        </div>
        <div class="bottom"></div>
      </div>
    </div>
    <div class="menu">
      <div class="btn" @click="handelSelectClick" title="选择角色">
        <img :src="getAvatar(input.character)" alt="" />
      </div>
      <input
        type="text"
        class="input"
        v-model="input.input"
        @keydown.enter="handelAddClick()"
      />
      <div class="btn" @click="handelImageClick" title="发送图片">
        <svg
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="3373"
          width="80"
          height="80"
        >
          <path
            d="M928 160H96c-17.7 0-32 14.3-32 32v640c0 17.7 14.3 32 32 32h832c17.7 0 32-14.3 32-32V192c0-17.7-14.3-32-32-32z m-40 632H136v-39.9l138.5-164.3 150.1 178L658.1 489 888 761.6V792z m0-129.8L664.2 396.8c-3.2-3.8-9-3.8-12.2 0L424.6 666.4l-144-170.7c-3.2-3.8-9-3.8-12.2 0L136 652.7V232h752v430.2z"
            fill="#707070"
          ></path>
          <path
            d="M304 456c48.6 0 88-39.4 88-88s-39.4-88-88-88-88 39.4-88 88 39.4 88 88 88z m0-116c15.5 0 28 12.5 28 28s-12.5 28-28 28-28-12.5-28-28 12.5-28 28-28z"
            fill="#707070"
          ></path>
        </svg>
      </div>
      <div class="btn" @click="handelNoticeClick" title="发送通知">
        <svg
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          width="70"
          height="70"
        >
          <path
            d="M889.828994 749.637494c-1.204099-1.548127-119.205779-166.165631-119.205779-287.435579 0-168.401814-76.202251-254.752898-162.725349-286.919536L607.897867 159.973123c0-52.980346-43.175542-95.983874-95.983874-95.983874S415.930119 107.164791 415.930119 159.973123l0 16.685369c-10.836889 7.912649-16.169326 21.845792-11.868974 35.262893 5.332437 16.857383 23.393919 25.974131 40.251302 20.641693 17.717453-5.676466 36.983034-8.428691 56.936671-8.428691l21.32975 0c115.249454 0 184.055098 89.103309 184.055098 238.239543 0 108.024861 72.933983 235.315303 110.261045 293.456073-57.452713 26.146145-183.023014 76.202251-304.809004 76.202251-121.441962 0-247.356291-50.400134-304.809004-76.546279 37.327062-57.968755 110.089031-184.915169 110.089031-293.112044 0-62.441122 11.524945-114.217369 34.574836-153.952629 8.77272-15.309256 3.612296-34.918864-11.69696-43.691584-15.48127-8.944734-34.918864-3.612296-43.691584 11.69696-28.554342 49.540064-43.175542 112.1532-43.175542 185.947253 0 121.269948-118.00168 285.199395-119.205779 286.919536-5.332437 7.568621-7.396607 16.857383-5.332437 25.974131 2.064169 8.944734 7.912649 16.685369 15.997312 20.985721 5.676466 3.096254 107.336805 57.280699 233.423148 84.458928 21.32975 66.397447 73.966068 111.29313 133.654964 111.29313s112.325214-44.895683 133.654964-111.29313c126.086343-27.178229 227.746682-81.018646 233.423148-83.942886 8.084663-4.472367 13.933143-12.040988 16.169326-20.985721C897.225601 766.666891 895.333445 757.206115 889.828994 749.637494zM501.249118 159.973123c-7.224593 0-14.277171 1.032085-21.32975 1.548127L479.919368 159.973123c0-17.545439 14.449185-31.994625 31.994625-31.994625 17.545439 0 31.994625 14.449185 31.994625 31.994625l0 0.860071c-7.224593-0.516042-14.277171-0.860071-21.32975-0.860071L501.249118 159.973123zM511.913993 928.016126c-22.361834 0-43.175542-13.417101-57.968755-35.262893 19.26558 2.064169 38.531161 3.268268 57.968755 3.268268s38.875189-1.376113 57.968755-3.268268C555.089535 914.599026 534.275827 928.016126 511.913993 928.016126z"
            fill="#575B66"
          ></path>
        </svg>
      </div>
      <div class="btn" @click="handelAddClick()" title="发送消息">
        <svg
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          width="70"
          height="70"
        >
          <path
            d="M950.784 73.187556H73.130667C32.796444 73.187556 0 113.237333 0 162.503111v551.367111c0 49.265778 32.796444 89.344 73.130667 89.344h280.433777l158.350223 147.598222 158.350222-147.598222h280.462222c40.362667 0 73.130667-40.049778 73.130667-89.344V162.503111c0.056889-49.265778-32.711111-89.315556-73.073778-89.315555z m24.348444 640.711111c0 18.346667-10.865778 33.223111-24.348444 33.223111H658.232889v0.568889l-0.341333-0.398223-145.948445 135.992889-145.948444-135.992889-0.341334 0.398223v-0.568889H73.130667c-13.454222 0-24.376889-14.876444-24.376889-33.223111V162.503111c0-18.289778 10.951111-33.166222 24.376889-33.166222h877.624889c13.511111 0 24.348444 14.876444 24.348444 33.166222v551.395556z"
            fill="#353535"
          ></path>
          <path
            d="M781.368889 304.298667H242.488889c-14.876444 0-26.936889 12.544-26.936889 28.017777 0 15.502222 12.060444 28.103111 26.936889 28.103112H781.368889c14.933333 0 27.022222-12.572444 27.022222-28.103112 0-15.473778-12.088889-28.017778-27.022222-28.017777zM511.971556 535.921778H242.488889c-14.876444 0-26.936889 12.572444-26.936889 28.074666s12.060444 28.046222 26.936889 28.046223h269.454222c14.876444 0 26.936889-12.544 26.936889-28.046223s-12.032-28.074667-26.908444-28.074666z"
            fill="#353535"
          ></path>
        </svg>
      </div>
    </div>
  </template>
  <template v-else>
    <div class="defalut-wrapper">
      <span>请选择联系人</span>
    </div>
  </template>
  <div class="btn-list">
    <div class="btn">
      <div class="icon" @click="handelMessageAddClick">
        <svg
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          width="50"
          height="50"
        >
          <path
            d="M950.784 73.187556H73.130667C32.796444 73.187556 0 113.237333 0 162.503111v551.367111c0 49.265778 32.796444 89.344 73.130667 89.344h280.433777l158.350223 147.598222 158.350222-147.598222h280.462222c40.362667 0 73.130667-40.049778 73.130667-89.344V162.503111c0.056889-49.265778-32.711111-89.315556-73.073778-89.315555z m24.348444 640.711111c0 18.346667-10.865778 33.223111-24.348444 33.223111H658.232889v0.568889l-0.341333-0.398223-145.948445 135.992889-145.948444-135.992889-0.341334 0.398223v-0.568889H73.130667c-13.454222 0-24.376889-14.876444-24.376889-33.223111V162.503111c0-18.289778 10.951111-33.166222 24.376889-33.166222h877.624889c13.511111 0 24.348444 14.876444 24.348444 33.166222v551.395556z"
            fill="#161616"
          ></path>
          <path
            d="M781.368889 304.298667H242.488889c-14.876444 0-26.936889 12.544-26.936889 28.017777 0 15.502222 12.060444 28.103111 26.936889 28.103112H781.368889c14.933333 0 27.022222-12.572444 27.022222-28.103112 0-15.473778-12.088889-28.017778-27.022222-28.017777zM511.971556 535.921778H242.488889c-14.876444 0-26.936889 12.572444-26.936889 28.074666s12.060444 28.046222 26.936889 28.046223h269.454222c14.876444 0 26.936889-12.544 26.936889-28.046223s-12.032-28.074667-26.908444-28.074666z"
            fill="#161616"
          ></path>
        </svg>
      </div>
      <span>发短信</span>
    </div>
    <div class="btn" v-if="setting.index">
      <div class="icon" @click="screenshot">
        <svg
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          width="60"
          height="60"
        >
          <path
            d="M835.3 250.9v522.3H188.7V250.9h646.6m49.8-49.8H138.9v621.8H885V201.1h0.1z"
            fill="#161616"
          ></path>
          <path
            d="M138.9 101.6v99.5H64.3v49.8H188.7V101.6zM885.1 922.4v-99.5h74.6v-49.8H835.3v149.3zM511 705.4H297.5c-7.8 0-20.4-2.9-23.3-7.8-2.9-4.9 1.9-16.5 5.8-23.3 26.2-39.8 53.4-79.6 79.6-119.4 8.7-12.6 17.5-13.6 31.1-7.8 44.6 21.4 90.3 42.7 135.9 64.1 12.6 5.8 28.1 1.9 35.9-9.7 24.3-37.9 49.5-74.7 75.7-111.6 4.9-6.8 13.6-17.5 20.4-17.5 7.8 0 13.6 12.6 16.5 20.4 24.3 60.2 47.6 121.3 70.9 181.5 9.7 25.2 5.8 31.1-23.3 31.1H511z m-78.6-298c0 29.1-25.2 52.4-54.4 51.4-29.1-1-51.4-23.3-51.4-51.4 0-29.1 24.3-52.4 54.4-51.4 27.1 0.9 51.4 24.2 51.4 51.4z"
            fill="#161616"
          ></path>
        </svg>
      </div>
      <span>保存对话</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import _screenshot from '@/assets/scripts/screenshot'
import { character } from '@/store/character'
import { input } from '@/store/input'
import { message } from '@/store/message'
import { setting } from '@/store/setting'
import draggable from '@marshallswain/vuedraggable'
import { computed, nextTick, ref, watch } from 'vue'
import { getAvatar } from '@/assets/scripts/avatar'

const messageDom = ref<HTMLElement | null>(null)
const messageListDom = ref<HTMLElement | null>(null)

const index = computed(() => {
  if (setting.index) {
    return message.list.findIndex(item => {
      return item.id === setting.index
    })
  } else {
    return -1
  }
})

watch(index, () => {
  if (index.value === -1) {
    setting.index = undefined
  }
  scrollToBottom(true)
})

const names = computed(() => {
  const name: string[] = []
  for (const _message of message.list[index.value].list) {
    if (_message.key !== '开拓者' && !name.includes(_message.key)) {
      name.push(_message.key)
    }
  }
  return name
})

const title = computed(() => {
  if (index.value === -1) return ''

  if (names.value.length === 1) return names.value[0]
  if (message.list[index.value].title) return message.list[index.value].title
  if (names.value.length > 1) return `${names.value.join('、')}、${setting.name}的群聊`
  return '未命名短信'
})

const info = computed(() => {
  if (index.value === -1) return undefined

  if (names.value.length === 1) {
    let info
    if (character.game[names.value[0]]) {
      info = character.game[names.value[0]].info
    } else if (character.custom[names.value[0]]) {
      info = character.custom[names.value[0]].info
    }
    return info
  } else {
    return undefined
  }
})

const handelMessageAddClick = () => {
  const time = Date.now()
  message.list.unshift({
    id: time,
    time,
    list: []
  })
  setting.index = time
}

const updateTitle = (e: Event) => {
  message.list[index.value].title = (e.target as HTMLInputElement).innerText
}

const updateText = (e: Event, key: number) => {
  message.list[index.value].list[key].text = (e.target as HTMLInputElement).innerText
  message.list[index.value].time = Date.now()
}

const handelSelectClick = () => {
  input.select = true
}

const handelAvatarClick = (key: number) => {
  input.index = [index.value, key]
  input.select = true
}

const handelImageClick = () => {
  const el = document.createElement('input')
  el.type = 'file'
  el.accept = 'image/*'
  el.onchange = () => {
    if (el.files?.[0]) {
      const file = new FileReader()
      file.readAsDataURL(el.files[0])
      file.onload = e => {
        handelAddClick(e.target?.result as string)
      }
    }
  }
  el.click()
}

const handelNoticeClick = () => {
  message.list[index.value].list.push({
    key: '开拓者',
    name: '',
    avatar: '',
    text: input.input || '愿此行，终抵群星',
    notice: true
  })
  message.list[index.value].time = Date.now()
  input.input = ''
  scrollToBottom()
}

const handelAddClick = (img?: string) => {
  message.list[index.value].list.push({
    key: input.character,
    name: input.character,
    avatar: getAvatar(input.character),
    text: input.input || '愿此行，终抵群星',
    img
  })
  message.list[index.value].time = Date.now()
  input.input = ''
  scrollToBottom()
}

const handelDelClick = (key: number) => {
  message.list[index.value].list.splice(key, 1)
  message.list[index.value].time = Date.now()
}

const scrollToBottom = (flag?: boolean) => {
  nextTick(() => {
    messageListDom.value?.scrollTo({
      top: messageListDom.value?.scrollHeight,
      behavior: flag ? undefined : 'smooth'
    })
  })
}

const screenshot = () => {
  if (messageDom.value && messageListDom.value) {
    _screenshot(messageDom.value, undefined, messageListDom.value.scrollHeight + 185 + 230)
  }
}
</script>

<style lang="stylus" scoped>
$width = 2000px

.defalut-wrapper
  display flex
  align-items center
  justify-content center
  position absolute
  top 180px
  left 1000px
  width $width
  height 1200px
  box-shadow 0 0 20px 5px rgba(0, 0, 0, 0.3)
  border-radius 0 50px 0 0
  background rgba(255, 255, 255, 0.1)

  &:after
    content ''
    position absolute
    box-sizing border-box
    left -15px
    bottom -15px
    width 100%
    height 15px
    border 5px solid #595556
    border-top none

  span
    color #b0aba5
    user-select none
    font-size 50px

.message-wrapper
  position absolute
  top 180px
  left 1000px
  width $width
  height 1200px
  box-shadow 0 0 20px 5px rgba(0, 0, 0, 0.3)
  border-radius 0 50px 0 0

  &:after
    content ''
    position absolute
    box-sizing border-box
    left -15px
    bottom -15px
    width 100%
    height 100%
    border 5px solid #595556
    border-top none
    border-right none
    pointer-events none

  .message-box
    display flex
    flex-direction column
    width 100%
    height 100%
    background #d8d8d8
    box-shadow 0 0 20px 5px rgba(0, 0, 0, 0.3)
    border-radius 0 50px 0 0

    .header
      display flex
      flex-direction column
      justify-content center
      box-sizing border-box
      width 100%
      height 185px
      border-bottom 4px solid #aeaeae
      padding 0 70px

      .title
        color #121212
        font-size 50px
        font-weight bold
        overflow hidden
        white-space nowrap
        text-overflow ellipsis

      .info
        color #6a6a6a
        font-size 40px
        overflow hidden
        white-space nowrap
        text-overflow ellipsis

    .message-list
      overflow-y overlay
      overflow-x hidden
      flex 1
      display flex
      flex-direction column
      margin 30px 60px 30px 50px
      padding-right 50px

      .notice
        display flex
        justify-content center
        align-items center
        width 100%
        height 60px
        padding 90px 0 20px 0
        font-size 30px
        color #949595

        &:hover
          background #ddd

          div
            div
              opacity 1

        span
          max-width 80%
          margin-left 20px
          overflow hidden
          white-space nowrap
          text-overflow ellipsis

        div
          position relative
          height 100%

          div
            display flex
            align-items center
            justify-content center
            position absolute
            right -80px
            top -5px
            width 60px
            height 60px
            font-size 60px
            opacity 0
            cursor pointer

            &:hover
              opacity 1

      .message
        display flex
        height fit-content
        width 100%
        margin 15px 0

        &:hover
          background #ddd

          .del
            opacity 1 !important

        .avatar
          flex-shrink 0
          overflow hidden
          border-radius 50%
          width 140px
          height 140px
          background #3a3a3a
          margin 0 35px 0 0
          cursor pointer

          img
            width 100%

        .message-content
          flex 1
          display flex
          flex-direction column

          .name
            position relative
            color #6b6b6b
            font-size 45px
            width fit-content

            .del
              display flex
              align-items center
              justify-content center
              position absolute
              right -100px
              bottom -6px
              width 80px
              height 80px
              font-size 50px
              opacity 0
              cursor pointer

              &:hover
                opacity 1

          .img
            margin-top 30px
            max-width 600px

            img
              width 100%

          .text
            background #ebebeb
            padding 35px
            margin-top 30px
            width fit-content
            font-size 45px
            color #121212
            border-radius 0 20px
            word-break break-word

    .bottom
      align-self center
      box-sizing border-box
      height 150px
      width 90%
      border-top 5px solid #b3b3b3

.right
  flex-direction row-reverse

  .avatar
    margin 0 0 0 35px !important

  .message-content
    align-items flex-end

    .text
      background #d3bb8b !important
      border-radius 20px 0 20px 20px !important

  .del
    left -100px
    right unset !important

.menu
  display flex
  align-items center
  box-sizing border-box
  position absolute
  bottom 60px
  left 1000px
  width $width
  height 150px
  border-top 5px solid #b3b3b3
  background #c7c8ca
  padding 0 10px

  .btn
    display flex
    align-items center
    justify-content center
    width 100px
    height 100px
    margin 0 10px
    cursor pointer
    border-radius 5px
    background #e8e8e8
    user-select none

    img
      width 100%

  .input
    flex 1
    height 100px
    margin 0 10px
    background #e8e8e8
    font-size 50px
    text-align center
    color #121212
    border none
    outline none
    box-shadow 5px 5px 15px #aaa
    border-radius 5px

.btn-list
  display flex
  position absolute
  left 190px
  bottom 100px

  .btn
    display flex
    color #ccc
    justify-content center
    align-items center
    user-select none
    margin-right 40px

    .icon
      cursor pointer
      background #e3e3e3
      border-radius 50%
      width 80px
      height 80px
      display flex
      justify-content center
      align-items center

    span
      margin-left 20px
      font-size 32px
      font-weight bold

.list-enter-active
  transition all 0.2s

.list-enter-from
  transform scaleY(0)

.list-enter-to
  transform scaleY(1)
</style>
