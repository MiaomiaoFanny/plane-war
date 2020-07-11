import { defineComponent, h, onMounted, onUnmounted } from "@vue/runtime-core";
import RestartBtn from '../component/RestartBtn'
import EndPageImg from '../../assets/end_page.jpg'

export default defineComponent({
  setup(_, ctx) {
    const handleEnter = e => {
      if (e.code === 'Enter') {
        ctx.emit('changePage', 'GamePage')
      }
    }
    onMounted(() => { window.addEventListener('keydown', handleEnter) })
    onUnmounted(() => { window.removeEventListener('keydown', handleEnter) })
  },
  render(ctx) {
    const vnode = h('Container', [
      h('Sprite', { texture: EndPageImg }),
      h(RestartBtn, {
        x: 225,
        y: 510,
        onClick() {
          ctx.$emit('changePage', 'GamePage')
        }
      }),
    ])
    return vnode
  }
})