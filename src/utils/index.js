import { onMounted, onUnmounted } from '@vue/runtime-core'
import { getTicker } from '../game';

export function hittingDetect(objA, objB) {
  if (!objA || !objB) {
    return false
  }
  return !(
    (objA.x + objA.width < objB.x) || // A 在 左
    (objB.x + objB.width < objA.x) || // A 在 右
    (objA.y + objA.height < objB.y) || // A 在 上
    (objB.y + objB.height < objA.y) // A 在 下
  )
}

export const addInterval = (action, interval) => {
  let timer
  onMounted(() => {
    timer = setInterval(action, interval)
  })
  onUnmounted(() => {
    clearInterval(timer)
  })
  return timer
}

export function addTicker(action) {
  const ticker = getTicker()
  if (typeof action === 'function') {
    onMounted(() => {
      ticker.add(action)
    })
    onUnmounted(() => {
      ticker.remove(action)
    })
  }
  return ticker
}

export * from './keyboard'