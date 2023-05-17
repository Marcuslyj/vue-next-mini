import { createRenderer } from '@vue/runtime-core'
import { extend, isString } from '@vue/shared'
import { patchProp } from './patchProp'
import { nodeOps } from './nodeOps'

// 平台层api
const rendererOptions = extend({ patchProp }, nodeOps)

let renderer

function ensureRenderer() {
  return renderer || (renderer = createRenderer(rendererOptions))
}

export const render = (...args) => {
  ensureRenderer().render(...args)
}
