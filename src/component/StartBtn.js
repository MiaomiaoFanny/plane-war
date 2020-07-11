import { defineComponent, h } from "@vue/runtime-core";
import StartBtnImg from '../../assets/startBtn.png'

export default defineComponent({
  render() {
    const vnode = h('Sprite', {
      texture: StartBtnImg,
      interactive: true, // 允许交互
    })
    return vnode
  }
})