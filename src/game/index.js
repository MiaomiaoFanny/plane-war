/* 游戏逻辑 细节 */

import * as PIXI from 'pixi.js'
import { handleKeydown, handleKeyup, hittingDetect, addInterval, addTicker } from '../utils'
import config from './config'
const {
  stageWidth, stageHeight,
  bulletWidth, bulletHeight,
  planeHeight,
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
    // 让飞机移动
  let dir = {
    UpDown: null,
    LeftRight: null,
    lastCode: null,
    minX: -plane.width * 0.6,
    maxX: stageWidth - plane.width * 0.5,
    minY: 0,
    maxY: stageHeight - plane.height * 0.4,
  }
  const recordMove = (e) => {
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
  }
  const clearMove = () => {
    switch (dir.lastCode) {
      case 'ArrowUp': case 'ArrowDown':
        dir.UpDown = null
        break
      case 'ArrowLeft': case 'ArrowRight':
        dir.LeftRight = null
        break
    }
  }
  handleKeydown(recordMove)
  handleKeyup(clearMove)
  addTicker(() => moveSelfPlane(plane, dir))
}
const moveSelfPlane = (plane, dir) => {
  // console.log('[in ticker] movePlane')
  if (dir.LeftRight === 'ArrowLeft' && plane.x >= dir.minX) {
    plane.x -= selfPlaneSpeed
  } else if (dir.LeftRight === 'ArrowRight' && plane.x <= dir.maxX) {
    plane.x += selfPlaneSpeed
  }

  if (dir.UpDown === 'ArrowUp' && plane.y >= dir.minY) {
    plane.y -= selfPlaneSpeed
  } else if (dir.UpDown === 'ArrowDown' && plane.y <= dir.maxY) {
    plane.y += selfPlaneSpeed
  }
}

// 敌方战机随机出场
export const handleEnemyShowUp = (enemies) => {
  const addEnemy = () => {
    if (enemies.length >= MaxEnemyPlane) {
      return
    }
    const minX = enemyWidth * -0.5, maxX = stageWidth - enemyWidth * 0.5
    const minY = enemyHeight * -0.7, maxY = enemyHeight * 0.3
    const pos = {
      x: minX + Math.random() * (maxX - minX),
      y: minY + Math.random() * (maxY - minY),
      width: enemyWidth,
      height: enemyHeight,
      attacked: 0,
    }
    enemies.push(pos)
  }
  addInterval(addEnemy, enemyShowInterval)
}

// 敌机随机移动
export const handleEnemyMove = (enemies) => {
  const moveEnemies = () => {
    // console.log('[in ticker] moveEnemies')
    enemies.forEach(enemy => {
      moveEnemy(enemy)
    })
  }
  addTicker(moveEnemies)
}
const moveEnemy = enemy => {
  enemy.recordTime = enemy.recordTime || 0
  enemy.recordTime++
  const minX = -(enemy.width / 2), maxX = stageWidth - enemy.width / 2
  const minY = -(enemy.height / 2), maxY = stageHeight - enemy.height / 2
  if(enemy.x <= minX) { enemy.x += enemyMoveSpeedX; enemy.xDir = true }
  else if(enemy.x >= maxX) { enemy.x -= enemyMoveSpeedX; enemy.xDir = false}
  else {
    if (enemy.recordTime >= EnemyChangeDirInterval) {
      enemy.recordTime = 0
      enemy.xDir = Math.random() > 0.5
    }
    if (enemy.xDir === true) { enemy.x  += enemyMoveSpeedX }
    else { enemy.x -= enemyMoveSpeedX }
  }

  if(enemy.y <= minY) { enemy.y += enemyMoveSpeedY; enemy.yDir = false}
  else if(enemy.y >= maxY) { enemy.y -= enemyMoveSpeedY; enemy.yDir = true}
  else {
    if (enemy.yDir === false) { enemy.y += enemyMoveSpeedY }
    else { enemy.y -= enemyMoveSpeedY }
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
  const shoot = () => {
    const len = selfBullets.length
    // console.log('[in ticker] shoot selfBullets count', len)
    for (let i = len - 1; i >= 0; i--) {
      const bullet = selfBullets[i]
      if (bullet.y < -bullet.height) { // 到达顶部
        selfBullets.splice(i, 1)
      } else {
        bullet.y -= selfBulletSpeed
        if (detectSelfBulletTouchEnemyPlane(bullet, enemies, score)) { // 检测碰撞
          selfBullets.splice(i, 1)
        }
      }
    }
  }
  addTicker(shoot)
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
  const shoot = () => {
    const len = enemyBullets.length
    // console.log('[in ticker] shoot enemyBullets count', len)
    for (let i = len - 1; i >= 0; i--) {
      const bullet = enemyBullets[i]
      if (bullet.y > stageHeight) { // 到达底部
        enemyBullets.splice(i, 1)
      } else {
        bullet.y += enemyBulletSpeed
        if (detectEnemyBulletTouchSelfBullets(bullet, selfBullets, score)) { // 检测碰撞
          enemyBullets.splice(i, 1)
        }
      }
    }
  }
  addTicker(shoot)
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