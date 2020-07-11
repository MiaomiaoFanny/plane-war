
import * as PIXI from 'pixi.js'
const game = new PIXI.Application({
  width: 750,
  height: 1080
})
// console.log('PIXI', PIXI)
// console.log('game', game)
document.body.appendChild(game.view)
export function getCanvasRootContainer() {
  return game.stage
}

export function getGame() {
  return game
}
