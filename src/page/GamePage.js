import { defineComponent, h, reactive, ref } from "@vue/runtime-core"
import { Map, RestartBtn, Plane, Enemy, BulletEnemy, BulletSelf } from '../component' 
import { PAGE } from '../page'
import {
  handlePlaneShowUp,
  handlePlaneMove,
  handleEnemyShowUp,
  handleEnemyMove,
  selfBulletShoot,
  selfBulletMove,
  enemyBulletShoot,
  enemyBulletMove,
  detectGameOver,
  config,
} from '../game'
import { handleKeydown } from '../utils'
const { stageWidth, stageHeight, planeWidth, planeHeight } = config

export default defineComponent({
  setup(_, ctx) {
    const score = ref(0)
    useKeyboard(ctx)
    const planeInfo = useCreatePlane()
    const enemies = useCreateEnemies()
    const selfBullets = reactive([])
    const enemyBullets = reactive([])
    useSelfAttack(planeInfo, selfBullets, enemies, score)
    useEnemyAttack(enemies, enemyBullets, selfBullets, score)
    useDetectGameOver(planeInfo, enemies, enemyBullets, ctx)

    return {
      planeInfo,
      enemies,
      selfBullets,
      enemyBullets,
      score
    }
  },
  render(ctx) {
    const renderItems = (list, component) => {
      return list.map(({x, y}) => h(component, {x, y}))
    }
    return h('Container', [
      h(Map),
      h(Plane, { // 此处为传入子组件的props入口
        x: ctx.planeInfo.x,
        y: ctx.planeInfo.y,
      }),
      ...renderItems(ctx.enemies, Enemy),
      ...renderItems(ctx.selfBullets, BulletSelf),
      ...renderItems(ctx.enemyBullets, BulletEnemy),
      h(RestartBtn, { x: 550, y: 10, width: 160, height: 50,
        onClick() {
          ctx.$emit('changePage', PAGE.RestartPage)
        }
      }),
      h('circle', {
        x: 600,
        y: 1000,
      }, [ctx.score])
    ])
  }
})

const useKeyboard = (ctx) => {
  handleKeydown({
    Escape() {
      ctx.emit('changePage', PAGE.StartPage)
    }
  })
}

// 创建我方战机
const useCreatePlane = () => {
  const point = reactive({
    x: stageWidth / 2 - planeWidth / 2,
    y: stageHeight,
    width: planeWidth,
    height: planeHeight,
  })
  handlePlaneShowUp(point)
  handlePlaneMove(point)
  return point
}

// 创建敌机
const useCreateEnemies = () => {
  const enemies = reactive([])
  handleEnemyShowUp(enemies)
  handleEnemyMove(enemies)
  return enemies;
}

// 我方子弹攻击
const useSelfAttack = (plane, selfBullets, enemies, score) => {
  selfBulletShoot(plane, selfBullets)
  selfBulletMove(selfBullets, enemies, score)
}

// 敌方子弹攻击
const useEnemyAttack = (enemies, enemyBullets, selfBullets, score) => {
  enemyBulletShoot(enemies, enemyBullets)
  enemyBulletMove(enemyBullets, selfBullets, score)
}

// 监测游戏结束 碰撞检测
const useDetectGameOver = (plane, enemies, enemyBullets, ctx) => {
  detectGameOver(plane, enemies, enemyBullets, () => {
    ctx.emit('changePage', PAGE.RestartPage)
  })
}
