import { Texture } from 'pixi.js'

/* 属性更新操作 */

const patchProp = (el, key, preValue, nextValue) => {
  // console.log('[patchProp]', key, preValue, nextValue)
  switch (key) {
    case 'texture':
      el.texture = Texture.from(nextValue)
      break;
    case 'onClick':
      el.on('pointertap', nextValue)
      break;
    default:
      el[key] = nextValue
      break;
  }
}
export default patchProp
