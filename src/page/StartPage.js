import { defineComponent, h, onMounted, onUnmounted } from "@vue/runtime-core";
import StartPageImg from '../../assets/start_page.jpg'
import StartBtn from '../component/StartBtn'

export default defineComponent({
  setup(_, ctx) {
    const handleEnter = e => {
      console.log(e.code)
      if (e.code === 'Enter') {
        ctx.emit('changePage', 'GamePage')
      } else if (e.code === 'ShiftRight' || e.code === 'ShiftLeft') {
        ctx.emit('changePage', 'BallPage')
      }
    }
    onMounted(() => { window.addEventListener('keydown', handleEnter) })
    onUnmounted(() => { window.removeEventListener('keydown', handleEnter) })
  },
  render(ctx) {
    const vnode = h('Container', [
      h('Sprite', { texture: StartPageImg }),
      h(StartBtn, {
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