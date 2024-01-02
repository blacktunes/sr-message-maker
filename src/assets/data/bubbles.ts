import { reactive } from 'vue'
import bubbles_0 from '@/assets/images/bubbles/0.webp'
import bubbles_0_preview from '@/assets/images/bubbles/0_preview.webp'
import bubbles_1 from '@/assets/images/bubbles/1.webp'
import bubbles_1_preview from '@/assets/images/bubbles/1_preview.webp'
import bubbles_2 from '@/assets/images/bubbles/2.webp'
import bubbles_2_preview from '@/assets/images/bubbles/2_preview.webp'
import bubbles_3 from '@/assets/images/bubbles/3.webp'
import bubbles_3_preview from '@/assets/images/bubbles/3_preview.webp'


export const bubbles = reactive([
  {
    name: '语言的艺术',
    img: bubbles_0,
    preview: bubbles_0_preview
  },
  {
    name: '兔子在哪里？',
    img: bubbles_1,
    preview: bubbles_1_preview
  },
  {
    name: '次元扑满',
    img: bubbles_2,
    preview: bubbles_2_preview
  },
  {
    name: '星体培养皿',
    img: bubbles_3,
    preview: bubbles_3_preview
  }
])
