import { defineComponent, h } from "@vue/runtime-core";
import EnemyImg from '../../assets/enemy.png'
import { config } from '../game'

export default defineComponent({
  props: ['x', 'y', 'width', 'height'],
  render(ctx) {
    return h('Container',
    [
      h('Sprite', {
        texture: EnemyImg,
        x: ctx.x,
        y: ctx.y,
        width: ctx.width || config.enemyWidth,
        height: ctx.height || config.enemyHeight,
      }),
    ])
  }
})
