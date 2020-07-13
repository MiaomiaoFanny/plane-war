import { defineComponent, h } from "@vue/runtime-core";
import StartPageImg from '../../assets/start_page.jpg'
import StartBtn from '../component/StartBtn'
import { PAGE } from '../page'
import { handleKeydown } from '../utils';

export default defineComponent({
  setup(_, ctx) {
    handleKeydown({
      Enter() {
        ctx.emit('changePage', PAGE.GamePage)
      },
      Shift() {
        ctx.emit('changePage', PAGE.BallPage)
      },
    })
  },
  render(ctx) {
    const vnode = h('Container', [
      h('Sprite', { texture: StartPageImg }),
      h(StartBtn, {
        x: 225,
        y: 510,
        onClick() {
          ctx.$emit('changePage', PAGE.GamePage)
        }
      }),
    ])
    return vnode
  }
})