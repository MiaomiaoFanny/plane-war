import { createRenderer } from '@vue/runtime-core'
import nodeOps from './nodeOps'
import patchProp from './patchProp'

/* 自定义canvas渲染操作选项 */
const rendererOptions = {
  patchProp,
  ...nodeOps
}

// canvas 渲染器
let renderer

function ensureRenderer() {
  return renderer || (renderer = createRenderer(rendererOptions))
}

// console.log('renderer', renderer)

export const render = ((...args) => {
  ensureRenderer().render(...args)
})

export const createApp = (...args) => {
  const app = ensureRenderer().createApp(...args)
  // console.log('app', app)
  return app
}
