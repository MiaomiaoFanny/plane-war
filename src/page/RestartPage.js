import { defineComponent, h } from "@vue/runtime-core";
import RestartBtn from '../component/RestartBtn'
import EndPageImg from '../../assets/end_page.jpg'
import { PAGE } from '../page'
import { handleKeydown } from '../utils';

export default defineComponent({
  setup(_, ctx) {
    handleKeydown({
      Enter() {
        ctx.emit('changePage', PAGE.GamePage)
      }
    })
  },
  render(ctx) {
    const vnode = h('Container', [
      h('Sprite', { texture: EndPageImg }),
      h(RestartBtn, {
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