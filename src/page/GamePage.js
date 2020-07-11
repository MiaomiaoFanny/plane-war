import { defineComponent, h, reactive, onMounted, onUnmounted, ref } from "@vue/runtime-core";
import Map from '../component/Map'
import RestartBtn from '../component/RestartBtn'
import Plane from '../component/Plane'
import Enemy from '../component/Enemy'
import BulletEnemy from '../component/BulletEnemy'
import BulletSelf from '../component/BulletSelf'
import { getGame } from '../Game'
import { hit } from '../utils'
const stageHeight = 1080, stageWidth = 750

export default defineComponent({
  setup(_, ctx) {
    const score = ref(0)
    useKeyboard(ctx)
    const planeInfo = useCreatePlane()
    const enemies = useCreateEnemies()
    const selfBullets = useCreateSelfBullets()
    const enemyBullets = useCreateEnemyBullets()
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
    const renderEnemies = () => {
      return ctx.enemies.map(enemy => {
        return h(Enemy, {
          x: enemy.x,
          y: enemy.y,
          width: enemy.width,
          height: enemy.height,
        })
      })
    }
    const renderSelfBullets = () => {
      return ctx.selfBullets.map(({x,y,width,height}) => {
        return h(BulletSelf, { x, y, width, height })
      })
    }
    const renderEnemyBullets = () => {
      return ctx.enemyBullets.map(({x,y,width,height}) => {
        return h(BulletEnemy, { x, y, width, height })
      })
    }
    return h('Container', [
      h(Map),
      h(Plane, { // 此处为传入子组件的props入口
        x: ctx.planeInfo.x,
        y: ctx.planeInfo.y,
      }),
      ...renderEnemies(),
      ...renderSelfBullets(),
      ...renderEnemyBullets(),
      h(RestartBtn, { x: 550, y: 10, width: 160, height: 50,
        onClick() {
          ctx.$emit('changePage', 'RestartPage')
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
  const handleEnter = e => {
    if (e.code === 'Escape') {
      ctx.emit('changePage', 'StartPage')
    }
  }
  onMounted(() => { window.addEventListener('keydown', handleEnter) })
  onUnmounted(() => { window.removeEventListener('keydown', handleEnter) })
}

// 创建我方战机
const useCreatePlane = () => {
  const planeHeight = 364, planeWidth = 258
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

// 我方战机缓动出场
const handlePlaneShowUp = (point) => {
  const min = stageHeight - point.height * 0.8
  const showUp = () => {
    if(point.y > min) 
      point.y -= 10
    else
      getGame().ticker.remove(showUp)
  }
  onMounted(() => { getGame().ticker.add(showUp) })
  onUnmounted(() => { getGame().ticker.remove(showUp) })
}

// 我方战机丝滑移动
const handlePlaneMove = (point) => {
    // 让飞机移动
  const createMove = () => {
    let dir = {
      speed: 5,
      UpDown: null,
      LeftRight: null,
      lastCode: null,
    }
    return {
      movePlane() {
      // console.log('[in ticker] >> movePlane')
        if (dir.UpDown === 'ArrowUp') {
          if (point.y >= 0) point.y -= dir.speed
        } else if( dir.UpDown === 'ArrowDown') {
          if (point.y <= stageHeight - point.height * 0.4) point.y += dir.speed
        }
        if (dir.LeftRight === 'ArrowLeft') {
          if (point.x >= -point.width * 0.6) point.x -= dir.speed
        } else if( dir.LeftRight === 'ArrowRight') {
          if (point.x <= stageWidth - point.width * 0.5) point.x += dir.speed
        }
      },
      recordMove(e) {
        dir.lastCode = e.code
        switch (e.code) {
          case 'ArrowUp': case 'ArrowDown':
            dir.UpDown = e.code
            break
          case 'ArrowLeft': case 'ArrowRight':
            dir.LeftRight = e.code
            break
          default:
            break;
        }
      },
      clearMove() {
        switch (dir.lastCode) {
          case 'ArrowUp': case 'ArrowDown':
            dir.UpDown = null
            break
          case 'ArrowLeft': case 'ArrowRight':
            dir.LeftRight = null
            break
        }
      }
    }
  }
  const { recordMove, clearMove, movePlane } = createMove()
  onMounted(() => {
    window.addEventListener('keydown', recordMove)
    window.addEventListener('keyup', clearMove)
    getGame().ticker.add(movePlane)
  })
  onUnmounted(() => {
    window.removeEventListener('keydown', recordMove)
    window.removeEventListener('keyup', clearMove)
    getGame().ticker.remove(movePlane)
  })
}

// 创建敌机
const useCreateEnemies = () => {
  // 每1秒产生一辆敌机
  const enemies = reactive([])
  const MaxEnemyPlane = 20, interval = 1000
  const enemyWidth = 308, enemyHeight = 207
  const addEnemy = (x, y) => {
    if (enemies.length >= MaxEnemyPlane) {
      return
    }
    const pos = {
      x: x || ((enemyWidth * -0.5) + Math.random() * ((stageWidth - enemyWidth * 0.5) -(enemyWidth * -0.5))),
      y: y || ((enemyHeight * -0.7) + Math.random() * ((enemyHeight * 0.3) - (enemyHeight * -0.7))),
      width: enemyWidth,
      height: enemyHeight,
    }
    enemies.push(pos)
  }
  let timer
  onMounted(() => {
    timer = setInterval(addEnemy, interval);
  })
  onUnmounted(() => {
    clearInterval(timer)
  })
  handleEnemyMove(enemies)
  return enemies;
}

// 敌机随机移动
const handleEnemyMove = (enemies) => {
  const moveEnemies = () => {
    const ySpeed = 0.5, xSpeed = 1
    enemies.forEach(enemy => {
      const minX = -(enemy.width / 2), maxX = stageWidth - enemy.width / 2
      const minY = -(enemy.height / 2), maxY = stageHeight - enemy.height / 2
      if(enemy.x <= minX) { enemy.x+=xSpeed; enemy.xDir = true }
      else if(enemy.x >= maxX) { enemy.x-=xSpeed; enemy.xDir = false}
      else {
        if (enemy.xDir === true) { enemy.x +=xSpeed }
        else { enemy.x-=xSpeed }
      }

      if(enemy.y <= minY) { enemy.y+=ySpeed; enemy.yDir = false}
      else if(enemy.y >= maxY) { enemy.y-=ySpeed; enemy.yDir = true}
      else {
        if (enemy.yDir === false) { enemy.y+=ySpeed }
        else { enemy.y-=ySpeed }
      }
    })
  }
  onMounted(() => { getGame().ticker.add(moveEnemies) })
  onUnmounted(() => { getGame().ticker.remove(moveEnemies) })
}

// 创建我方子弹
const useCreateSelfBullets = () => {
  // 创建我方子弹
  const bullets = reactive([])
  return bullets
}

// 创建敌机子弹
const useCreateEnemyBullets = () => {
  // 创建敌方子弹
  const bullets = reactive([])
  return bullets
}

// 我方子弹攻击
const useSelfAttack = (plane, selfBullets, enemies, score) => {
  // 我方发射子弹
  const MaxSelfBullet = 20
  const bulletWidth = 61, bulletHeight = 99
  // console.log('selfBullets', selfBullets, selfBullets.length)
  const handleAttack = e => {
    if (selfBullets.length >= MaxSelfBullet) return
    if(e.code === 'Space') {
      let x = plane.x + (plane.width / 2 - bulletWidth / 2.3)
      let y = plane.y - bulletHeight / 2.5
      selfBullets.push({
        x, y, width: bulletWidth, height: bulletHeight
      })
    }
  }
  onMounted(() => {
    window.addEventListener('keydown', handleAttack)
  })
  onUnmounted(() => {
    window.removeEventListener('keydown', handleAttack)
  })
  selfShoot(selfBullets, enemies, score)
}

// 我方子弹发射
const selfShoot = (selfBullets, enemies, score) => {
  // 我方子弹移动
  const speed = 6
  const shoot = () => {
    const len = selfBullets.length
    // console.log('[in ticker] -1 self selfBullets count', len)
    for (let i = len - 1; i >= 0; i--) {
      const bullet = selfBullets[i]
      if (bullet.y < -bullet.height) { // 到达顶部
        selfBullets.splice(i, 1)
      } else {
        bullet.y -= speed
        if (detectSelfBulletTouchEnemyPlane(bullet, enemies)) { // 检测碰撞
          score.value += 2
          selfBullets.splice(i, 1)
        }
      }
    }
  }
  const ticker = getGame().ticker.add(shoot)
  onUnmounted(() => {
    ticker.remove(shoot)
  })
  return ticker
}

// 敌方子弹攻击
const useEnemyAttack = (enemies, enemyBullets, selfBullets, score) => {
  // 定时发射子弹
  const MaxEnemyBullet = 50
  const bulletWidth = 61,
    bulletHeight = 99
  const launch = () => {
    if (enemyBullets.length >= MaxEnemyBullet) return
    enemies.forEach(enemy => {
      let x = enemy.x + (enemy.width / 2 - bulletWidth / 2)
      let y = enemy.y + enemy.height
      enemyBullets.push({
        x, y, width: bulletWidth, height: bulletHeight
      })
    })
  }
  setInterval(launch, 1000);
  enemyShoot(enemyBullets, selfBullets, score)
}
// 敌方子弹发射
const enemyShoot = (enemyBullets, selfBullets, score) => {
  // 敌方子弹移动
  const speed = 6
  const shoot = () => {
    const len = enemyBullets.length
    // console.log('[in ticker] -2 self enemyBullets count', len)
    for (let i = len - 1; i >= 0; i--) {
      const bullet = enemyBullets[i]
      if (bullet.y > stageHeight) { // 到达底部
        enemyBullets.splice(i, 1)
      } else {
        bullet.y += speed
        if (detectEnemyBulletTouchSelfBullets(bullet, selfBullets, score)) { // 检测碰撞
          enemyBullets.splice(i, 1)
        }
      }
    }
  }
  const ticker = getGame().ticker.add(shoot)
  onUnmounted(() => {
    ticker.remove(shoot)
  })
  return ticker
}

// 监测游戏结束 碰撞检测
const useDetectGameOver = (plane, enemies, enemyBullets, ctx) => {
  const detect = () => {
    // console.log('[in ticker] -3 useDetectGameOver')
    if (detectEnemyPlaneTouchSelfPlane(enemies, plane) ||
        detectEnemyBulletTouchSelfPlane(enemyBullets, plane)
    ) {
      ctx.emit('changePage', 'RestartPage')
    }
  }
  const ticker = getGame().ticker.add(detect)
  onUnmounted(() => {
    ticker.remove(detect)
  })
  return ticker
}

/* 碰撞检测 */
// 我方子弹 >> 敌军战机 (我方子弹循环中检测)
const detectSelfBulletTouchEnemyPlane = (bullet, enemies) => {
  const len = enemies.length
  // console.log('[detectSelfBulletTouchEnemyPlane] bullet', bullet, 'enemies count', len)
  for (let i = len - 1; i >= 0; i--) {
    const enemy = enemies[i]
    if (hit(bullet, {
      x: enemy.x,
      y: enemy.y - 20, // 去掉边界
      width: enemy.width,
      height: enemy.height,
    })) {
      // console.log('Hiting!!!!!!!! > 1 我方子弹 >> 敌军战机')
      enemies.splice(i, 1)
      return true
    }
  }
  return false
}

// 敌军飞机 >> 我方飞机
const detectEnemyPlaneTouchSelfPlane = (enemies, plane) => {
  const len = enemies.length
  // console.log('[detectEnemyPlaneTouchSelfPlane] plane', plane, 'enemies count', len)
  for (let i = len - 1; i >= 0; i--) {
    if (hit({
      x: plane.x,
      y: plane.y + 60,
      width: plane.width,
      height: plane.height,
    }, enemies[i])) {
      // console.log('Hiting!!!!!!!! > 2 敌军飞机 >> 我方飞机')
      enemies.splice(i, 1)
      return true
    }
  }
  return false
}

// 敌军子弹 >> 我方子弹 (敌军子弹循环中检测)
const detectEnemyBulletTouchSelfBullets = (bullet, selfBullets, score) => {
  const len = selfBullets.length
  // console.log('[detectEnemyBulletTouchSelfBullets] bullet', bullet, 'selfBullets count', len)
  for (let i = len - 1; i >= 0; i--) {
    if (hit(bullet, selfBullets[i])) {
      // console.log('Hiting!!!!!!!! > 3 敌军子弹 >> 我方子弹')
      selfBullets.splice(i, 1)
      score.value++
      return true
    }
  }
  return false
}

// 敌军子弹 >> 我方飞机 (敌军子弹循环中检测)
const detectEnemyBulletTouchSelfPlane = (enemyBullets, plane) => {
  const len = enemyBullets.length
  // console.log('[detectEnemyBulletTouchSelfPlane] enemyBullets count', len, ts)
  for (let i = len - 1; i >= 0; i--) {
    if (hit(enemyBullets[i], {
      x: plane.x + 35,
      y: plane.y + 75,
      width: plane.width - 60,
      height: plane.height,
    })) {
      // console.log('Hiting!!!!!!!! > 4 敌军子弹 >> 我方飞机', 'enemyBullet:', enemyBullets[i], 'plane', plane)
      enemyBullets.splice(i, 1)
      return true
    }
  }
  return false
}