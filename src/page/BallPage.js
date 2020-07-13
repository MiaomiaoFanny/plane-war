import { defineComponent, h, reactive } from "@vue/runtime-core";
import { hittingDetect, handleKeydown, addTicker } from '../utils'
import { PAGE } from '../page'
/* @todo:
1. 正確碰撞计数
2. 每秒新增小球
3. 碰撞销毁小球
 */
export default defineComponent({
  setup(_, ctx) {
    useKeyboard(ctx)
    const balls = reactive([{
      x: 0,
      y: 100,
      xDir: true,
      yDir: false,
      xSpeed: 4,
      ySpeed: 4,
      width: 80,
      height: 80,
      color: 0xff0000,
      hit: 0,
    },{
      x: 100,
      y: 200,
      xDir: true,
      yDir: false,
      xSpeed: 4,
      ySpeed: 4,
      width: 80,
      height: 80,
      color: 0xff0000,
      hit: 0,
    }, {
      x: 200,
      y: 300,
      xDir: false,
      yDir: false,
      xSpeed: 10,
      ySpeed: 10,
      width: 80,
      height: 80,
      color: 0xffffff,
      hit: 0,
    }, {
      x: 300,
      y: 400,
      xDir: false,
      yDir: false,
      xSpeed: 10,
      ySpeed: 10,
      width: 80,
      height: 80,
      color: 0xffffff,
      hit: 0,
    }, {
      x: 400,
      y: 500,
      xDir: false,
      yDir: false,
      xSpeed: 10,
      ySpeed: 10,
      width: 80,
      height: 80,
      color: 0xffffff,
      hit: 0,
    }, {
      x: 500,
      y: 600,
      xDir: false,
      yDir: false,
      xSpeed: 10,
      ySpeed: 10,
      width: 80,
      height: 80,
      color: 0xffffff,
      hit: 0,
    }, {
      x: 600,
      y: 700,
      xDir: false,
      yDir: false,
      xSpeed: 10,
      ySpeed: 10,
      width: 80,
      height: 80,
      color: 0xffffff,
      hit: 0,
    }, {
      x: 700,
      y: 800,
      xDir: false,
      yDir: false,
      xSpeed: 10,
      ySpeed: 10,
      width: 80,
      height: 80,
      color: 0xffffff,
      hit: 0,
    }])
    // useAddBalls()
    useMoveBalls(balls)
    return {
      balls
    }
  },
  render(ctx) {
    const renderBalls = () => {
      return ctx.balls.map((ball, id) => {
        return h('circle', {
          x: ball.x,
          y: ball.y,
          color: ball.color,
        },
        // [`${ball.hit}(${id+1})`]
        )
      })
    }
    return h('Container', [
      ...renderBalls()
    ])
  }
})

const useKeyboard = ctx => {
  handleKeydown({
    Escape() {
      ctx.emit('changePage', PAGE.StartPage)
    }
  })
}

const useMoveBalls = (balls) => {
  balls.forEach((ball, id) => moveBall(ball, id, balls))
}

const moveBall = (ball, id, balls) => {
  const stageWidth = 750, stageHeight = 1080
  const moveBall = () => {
    const hit = detectHit(ball, id, balls)
    if(ball.x <= 0) { ball.x+=ball.xSpeed; ball.xDir = true }
    else if(ball.x >= stageWidth - ball.width) { ball.x-=ball.xSpeed; ball.xDir = false}
    else {
      // ball.xDir = Math.random() > 0.5 ? true : false
      if (ball.xDir === true) { ball.x += ball.xSpeed + hit.x }
      else { ball.x-=ball.xSpeed + hit.x }
    }

    if(ball.y <= 0) { ball.y+=ball.ySpeed; ball.yDir = false}
    else if(ball.y >= stageHeight  - ball.height) { ball.y-=ball.ySpeed; ball.yDir = true}
    else {
      // ball.yDir = Math.random() > 0.5 ? false : true
      if (ball.yDir === false) { ball.y += ball.ySpeed + hit.y }
      else { ball.y-=ball.ySpeed + hit.y }
    }
  }
  addTicker(moveBall)
}

const detectHit = (ball, id, balls) => {
  let res = {x: 0, y: 0}
  for(let i = balls.length - 1; i >= 0; i--) {
    if(id === i) { continue }
    const otherBall = balls[i]
    if (hittingDetect(otherBall, ball)) {
      ball.xDir = !ball.xDir
      ball.yDir = !ball.yDir
      ball.hit++
      otherBall.hit++
      // res.x = Math.max(ball.xSpeed, otherBall.xSpeed) + 2
      // res.y = Math.max(ball.ySpeed, otherBall.ySpeed) + 2
      // console.log('hit!!!', id, i, res)
      break
    }
  }
  return res
}

const useAddBalls = () => {
  setInterval(() => {
    const ball = reactive({
      x: 300,
      y: 500,
      width: 80,
      height: 80,
    })
    balls.push(ball)
    moveBall(ball)
  }, 1000);
}