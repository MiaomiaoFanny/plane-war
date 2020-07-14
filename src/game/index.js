/* 游戏逻辑 细节 */

import * as PIXI from 'pixi.js'
import { handleKeydown, handleKeyup, hittingDetect, addInterval, addTicker } from '../utils'
import keyboardMovePlane, { isReachEdge } from './keyboardMovePlane'
import moveBullets from './moveBullets'
import config from './config'
const {
  stageWidth, stageHeight,
  bulletWidth, bulletHeight,
  planeWidth, planeHeight,
  enemyWidth, enemyHeight,
  MaxSelfBullet, MaxEnemyBullet,
  MaxEnemyPlane, enemyShowInterval,
  enemyMoveSpeedX, enemyMoveSpeedY,
  EnemyChangeDirInterval, enemyMaxAttacked,
  selfPlaneSpeed,
  selfBulletSpeed, enemyBulletSpeed
} = config
const game = new PIXI.Application({
  width: stageWidth,
  height: stageHeight
})
// console.log('game', game)
document.body.appendChild(game.view)
document.body.style.background = "#343434"
game.renderer.backgroundColor = 0x061639;
export {
  config
}
export function getStage() {
  return game.stage
}
export function getGame() {
  return game
}
export function getTicker() {
  return game.ticker
}

// 我方战机缓动出场
export const handlePlaneShowUp = (plane) => {
  const minY = stageHeight - planeHeight * 0.8
  const showUpSpeed = 10
  const showUp = () => {
    // console.log('[in ticker] showUp')
    if (plane.y > minY) {
      plane.y -= showUpSpeed
    } else {
      ticker.remove(showUp)
    }
  }
  const ticker = addTicker(showUp)
}

// 我方战机丝滑移动
export const handlePlaneMove = (plane) => {
  const {x, y} = keyboardMovePlane(plane.x, plane.y, selfPlaneSpeed, 0, stageHeight - planeHeight / 2, -planeWidth / 2, stageWidth - planeWidth / 2)
  plane.x = x
  plane.y = y
}

// 敌方战机随机出场
export const handleEnemyShowUp = (enemies) => {
  const addEnemy = () => {
    if (enemies.length >= MaxEnemyPlane) {
      return
    }
    const minX = -(enemyWidth / 2), maxX = stageWidth - enemyWidth / 2
    const minY = enemyHeight * -0.7, maxY = enemyHeight * 0.3
    const pos = {
      x: minX + Math.random() * (maxX - minX),
      y: minY + Math.random() * (maxY - minY),
      width: enemyWidth,
      height: enemyHeight,
      xDir: Math.random() > 0.5 ? 1 : -1,
      yDir: Math.random() > 0.5 ? 1 : -1,
      attacked: 0,
      recordTime: 0,
    }
    enemies.push(pos)
  }
  addInterval(addEnemy, enemyShowInterval)
}

// 敌机随机移动
export const handleEnemyMove = (enemies) => {
  const minX = -(enemyWidth / 2), maxX = stageWidth - enemyWidth / 2
  const minY = -(enemyHeight / 2), maxY = stageHeight - enemyHeight / 2
  const moveEnemies = () => {
    // console.log('[in ticker] moveEnemies')
    enemies.forEach(enemy => {
      moveEnemy(enemy)
    })
  }
  addTicker(moveEnemies)
  const moveEnemy = enemy => {
    enemy.recordTime++
    if (isReachEdge([minX, maxX], enemy.x, enemy.xDir)) {
      enemy.xDir = enemy.xDir * -1
    } else {
      if (enemy.recordTime >= EnemyChangeDirInterval) {
        enemy.recordTime = 0
        enemy.xDir = Math.random() > 0.5 ? 1 : -1
      }
    }
    enemy.x += (enemyMoveSpeedX * enemy.xDir);

    if (isReachEdge([minY, maxY], enemy.y, enemy.yDir)) {
      enemy.yDir = enemy.yDir * -1
    }
    enemy.y += (enemyMoveSpeedY * enemy.yDir);
  }
}

// 我方发射子弹 按住空格键不放, 持续发子弹
export const selfBulletShoot = (plane, selfBullets) => {
  const attackInterval = 10
  let isAttacking = false, attackTime = 0
  const handleTicker = () => {
    if (selfBullets.length >= MaxSelfBullet) return
    if (isAttacking && attackTime >= attackInterval) {
      attackTime = 0
      addBullet(plane, selfBullets)
    }
    attackTime++
  }
  handleKeydown({
    Space() {
      if (!isAttacking) {
        attackTime = attackInterval
      }
      isAttacking = true
    }
  })
  handleKeyup({
    Space() {
      isAttacking = false
    }
  })
  addTicker(handleTicker)
}
const addBullet = (plane, selfBullets) => {
  let x = plane.x + (plane.width / 2 - bulletWidth / 2.3)
  let y = plane.y - bulletHeight / 2.5
  selfBullets.push({
    x, y, width: bulletWidth, height: bulletHeight
  })
}

// 我方子弹移动
export const selfBulletMove = (selfBullets, enemies, score) => {
  const detectDestroy = (bullet) => {
    return detectSelfBulletTouchEnemyPlane(bullet, enemies, score)
  }
  addTicker(() => { moveBullets(selfBullets, -1, selfBulletSpeed, detectDestroy) })
}

// 敌方定时发射子弹
export const enemyBulletShoot = (enemies, enemyBullets) => {
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
}

// 敌方子弹移动
export const enemyBulletMove = (enemyBullets, selfBullets, score) => {
  const detectDestroy = (bullet) => {
    return detectEnemyBulletTouchSelfBullets(bullet, selfBullets, score) // 检测碰撞
  }
  addTicker(() => { moveBullets(enemyBullets, 1, enemyBulletSpeed, detectDestroy) })
}

export const detectGameOver = (plane, enemies, enemyBullets, gameover) => {
  if (!gameover) return
  const detect = () => {
    // console.log('[in ticker] detectGameOver')
    if (detectEnemyPlaneTouchSelfPlane(enemies, plane) ||
      detectEnemyBulletTouchSelfPlane(enemyBullets, plane)
    ) {
      gameover && gameover()
    }
  }
  addTicker(detect)
}

/* 碰撞检测 */
// 我方子弹 >> 敌军战机 (我方子弹循环中检测)
const detectSelfBulletTouchEnemyPlane = (bullet, enemies, score) => {
  const len = enemies.length
  // console.log('[detectSelfBulletTouchEnemyPlane] bullet', bullet, 'enemies count', len)
  for (let i = len - 1; i >= 0; i--) {
    const enemy = enemies[i]
    if (hittingDetect(bullet, {
      x: enemy.x,
      y: enemy.y - 20, // 去掉边界
      width: enemy.width,
      height: enemy.height,
    })) {
      enemy.attacked++
      // console.log('Hiting!!!!!!!! > 1 我方子弹 >> 敌军战机')
      if(enemy.attacked >= enemyMaxAttacked) {
        score.value+=3
        enemies.splice(i, 1)
      }
      return true
    }
  }
  return false
}

// 敌军飞机 >> 我方飞机 (game over!)
const detectEnemyPlaneTouchSelfPlane = (enemies, plane) => {
  const len = enemies.length
  // console.log('[detectEnemyPlaneTouchSelfPlane] plane', plane, 'enemies count', len)
  for (let i = len - 1; i >= 0; i--) {
    if (hittingDetect({
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
    if (hittingDetect(bullet, selfBullets[i])) {
      // console.log('Hiting!!!!!!!! > 3 敌军子弹 >> 我方子弹')
      selfBullets.splice(i, 1)
      score.value++
      return true
    }
  }
  return false
}

// 敌军子弹 >> 我方飞机 (game over!)
const detectEnemyBulletTouchSelfPlane = (enemyBullets, plane) => {
  const len = enemyBullets.length
  // console.log('[detectEnemyBulletTouchSelfPlane] enemyBullets count', len, ts)
  for (let i = len - 1; i >= 0; i--) {
    if (hittingDetect(enemyBullets[i], {
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