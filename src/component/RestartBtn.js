import { defineComponent, h } from "@vue/runtime-core";
import RestartBtnImg from '../../assets/restartBtn.png'

export default defineComponent({
  render() {
    const vnode = h('Sprite', {
      texture: RestartBtnImg,
      interactive: true, // 允许交互
    })
    return vnode
  }
})