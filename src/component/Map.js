import { defineComponent, h, ref } from "@vue/runtime-core"
import MapImg from "../../assets/map.jpg"
import { addTicker } from "../utils"
import { config } from "../game"

const { stageHeight, mapScrollSpeed } = config

export default defineComponent({
  setup() {
    const mapY1 = ref(0)
    const mapY2 = ref(-stageHeight)
    useMapScroll(mapY1, mapY2)
    return {
      mapY1,
      mapY2,
    }
  },
  render(ctx) {
    const vnode = h('Container', [
      h('Sprite', { texture: MapImg, y: ctx.mapY1 }),
      h('Sprite', { texture: MapImg, y: ctx.mapY2 }),
    ])
    return vnode
  }
})

// 让地图滚动起来
const useMapScroll = (mapY1, mapY2) => {
  const scroll = () => {
    mapY1.value += mapScrollSpeed
    mapY2.value += mapScrollSpeed
    if (mapY1.value >= stageHeight) {
      mapY1.value = -stageHeight
    }
    if (mapY2.value >= stageHeight) {
      mapY2.value = -stageHeight
    }
  }
  addTicker(scroll)
}