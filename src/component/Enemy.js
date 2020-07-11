import { defineComponent, h } from "@vue/runtime-core";
import EnemyImg from '../../assets/enemy.png'

export default defineComponent({
  props: ['x', 'y', 'width', 'height'],
  render(ctx) {
    return h('Container',
    [
      h('Sprite', {
        texture: EnemyImg,
        x: ctx.x, y: ctx.y,
      }),
    ])
  }
})
