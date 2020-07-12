import { Graphics, Text, Container, Sprite } from 'pixi.js'
/* 基本操作: 创建元素, 设置文本... */

export default {
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
