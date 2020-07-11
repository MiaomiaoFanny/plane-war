import { createRenderer } from '@vue/runtime-core'
import nodeOps from './nodeOps'
import patchProp from './patchProp'

const renderOptions = {
  patchProp,
  ...nodeOps
}
const renderer = createRenderer(renderOptions)
// console.log('renderer', renderer)

export function createApp(rootComponent) {
  const app = renderer.createApp(rootComponent)
  // console.log('app', app)
  // console.log('rootComponent', rootComponent)
  return app
}
