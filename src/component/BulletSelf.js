import { defineComponent, h } from "@vue/runtime-core";
import bulletImg from '../../assets/bunny-self.png'
import { config } from '../game'

export default defineComponent({
  props: ['x', 'y', 'width', 'height'], // 提供子弹初始位置
  render(ctx) {
    return h('Container', [
      h('Sprite', {
        texture: bulletImg,
        x: ctx.x,
        y: ctx.y,
        width: ctx.width || config.bulletWidth,
        height: ctx.height || config.bulletHeight,
      })
    ])
  }
})
