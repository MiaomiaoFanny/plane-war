import { defineComponent, h, ref } from "@vue/runtime-core";
import MapImg from "../../assets/map.jpg";
import { getGame } from "../Game";

export default defineComponent({
  setup() {
    const { mapY1, mapY2 } = useMapScroll()
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

const useMapScroll = () => {
    // 让地图滚动起来
    const MapHeight = 1080
    const mapY1 = ref(0)
    const mapY2 = ref(-MapHeight)
    const speed = 5
    getGame().ticker.add(() => {
      mapY1.value += speed
      mapY2.value += speed
      if (mapY1.value >= MapHeight) {
        mapY1.value = -MapHeight
      }
      if (mapY2.value >= MapHeight) {
        mapY2.value = -MapHeight
      }
    })
    return {
      mapY1, mapY2
    }
}