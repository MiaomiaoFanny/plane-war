import { createRenderer, h } from '@vue/runtime-core'
import { Graphics, Text, Container, Sprite, Texture } from 'pixi.js'
const renderOptions = {
  createElement(tag) {
    // console.log('[createElement]', tag)
    let element
    switch(tag) {
      case 'Container':
        element = new Container()
        break
      case 'Sprite':
        element = new Sprite()
        break
      case 'circle':
        element = new Graphics()
        element.beginFill(0xffffff, 1)
        element.drawCircle(20, 20, 40)
        element.endFill()
      default:
        break
    }
    return element
  },
  createText(text) {
    const canvasText = new Text(text)
    return canvasText
  },
  createComment(text) {
    // console.log('[createComment]', text)
  },
  patchProp: function(el, key, preValue, nextValue) {
    // console.log('[patchProp]', key, preValue, nextValue)
    switch(key) {
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
  },
  insert(child, parent, anchor) {
    // console.log('[insert]', parent, child)
    if (parent && child)
      parent.addChild(child)
  },
  remove(el) {
    const parent = el.parent
    if(parent) {
      parent.removeChild(el)
    }
  },
  setText(node, text){
    node.text = text;
  },
  setElementText(el, text) {
    const canvasText = new Text(text)
    el.addChild(canvasText)
  },
  parentNode(node){},
  nextSibling(node) {},
  // querySelector(selector) {},
  // setScopeId(node, id) {},
  // cloneNode(el){},
  // insertStaticContent(){},
  // setStaticContent(){},
}
const renderer = createRenderer(renderOptions)
// console.log('renderer', renderer)

export function createApp(rootComponent) {
  const app = renderer.createApp(rootComponent)
  // console.log('app', app)
  // console.log('rootComponent', rootComponent)
  return app
}
