
import { isReachEdge } from './keyboardMovePlane'
import { stageHeight, bulletHeight } from './config'

const moveBullets = (bullets, dir, speed, detectDestroy) => {
  const moveBullet = (bullet, i) => {
    if (isReachEdge([-bulletHeight, stageHeight], bullet.y, dir)) { // 到达边界
      bullets.splice(i, 1)
    } else {
      bullet.y += speed * dir
      if (detectDestroy && detectDestroy(bullet)) {
        bullets.splice(i, 1)
      }
    }
  }
  const len = bullets.length
  // if(len > 0) console.log('[in ticker] moveBullets count', len, dir > 0 ? 'enemy' : 'self')
  for (let i = len - 1; i >= 0; i--) {
    moveBullet(bullets[i], i)
  }
}

export default moveBullets