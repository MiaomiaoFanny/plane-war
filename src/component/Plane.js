import { defineComponent, h, reactive, toRefs, watch, onMounted, onUnmounted } from "@vue/runtime-core";
import PlaneImg from '../../assets/plane.png'

export default defineComponent({
  props: ['x', 'y', 'width', 'height'],
  render(ctx) { // props 也自动加入 ctx
    return h('Container',
    [
      h('Sprite', {
        texture: PlaneImg,
        x: ctx.x, y: ctx.y, // !直接同步props的值
      }),
    ])
  }
})
