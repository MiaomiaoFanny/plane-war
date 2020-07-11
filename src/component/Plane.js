import { defineComponent, h } from "@vue/runtime-core";
import PlaneImg from '../../assets/plane.png'
import { config } from '../game'

export default defineComponent({
  props: ['x', 'y', 'width', 'height'],
  render(ctx) { // props 也自动加入 ctx
    return h('Container',
    [
      h('Sprite', {
        texture: PlaneImg,
        x: ctx.x,
        y: ctx.y,
        width: ctx.width || config.planeWidth,
        height: ctx.height || config.planeHeight,
      }),
    ])
  }
})
