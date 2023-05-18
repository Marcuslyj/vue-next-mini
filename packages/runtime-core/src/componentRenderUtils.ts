import { ShapeFlags } from 'packages/shared/src/shapeFlags'
import { createVNode, Text } from './vnode'

/**
 * 解析 render 函数的返回值
 */
// export function renderComponentRoot(instance) {
// 	const { vnode, render, data = {} } = instance

// 	let result
// 	try {
// 		// 解析到状态组件
// 		if (vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
// 			// 获取到 result 返回值，如果 render 中使用了 this，则需要修改 this 指向
// 			result = normalizeVNode(render!.call(data, data))
// 		}
// 	} catch (err) {
// 		console.error(err)
// 	}

// 	return result
// }

/**
 * 标准化 VNode
 * return VNode
 */
export function normalizeVNode(child) {
  // 是对象就是vnode？
  if (typeof child === 'object') {
    return cloneIfMounted(child)
  } else {
    return createVNode(Text, null, String(child))
  }
}

/**
 * clone VNode
 */
export function cloneIfMounted(child) {
  // 源码的实现逻辑比较复杂
  return child
}

/**
 * 解析 render 函数的返回值
 */
export function renderComponentRoot(instance) {
  const { vnode, render, data = {} } = instance

  let result
  try {
    // 解析到状态组件
    if (vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
      // 获取到 result 返回值，如果 render 中使用了 this，则需要修改 this 指向
      // result = normalizeVNode(render!.call(data, data))
      result = normalizeVNode(render!())
    }
  } catch (err) {
    console.error(err)
  }

  return result
}
