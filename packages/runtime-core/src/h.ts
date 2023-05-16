import { isObject, isArray } from '@vue/shared'
import { VNode, isVNode, createVNode } from './vnode'

/**
 * h函数就是格式化了一下传参，支持灵活传参，支持传一个、两个、三个或以上参数，第二个参数是props还是children
 * 底层是调用createVNode，createVNode接收三个参数：type，props，children
 * @param type
 * @param propsOrChildren
 * @param children
 * @returns
 */
export function h(type: any, propsOrChildren?: any, children?: any): VNode {
  // 获取用户传递的参数数量
  const l = arguments.length
  // 如果用户只传递了两个参数，那么证明第二个参数可能是 props , 也可能是 children
  if (l === 2) {
    // 如果 第二个参数是对象，但不是数组。则第二个参数只有两种可能性：1. VNode 2.普通的 props
    if (isObject(propsOrChildren) && !isArray(propsOrChildren)) {
      // 如果是 VNode，则 第二个参数代表了 children
      if (isVNode(propsOrChildren)) {
        return createVNode(type, null, [propsOrChildren])
      }
      // 如果不是 VNode， 则第二个参数代表了 props
      return createVNode(type, propsOrChildren)
    }
    // 如果第二个参数不是单纯的 object，则 第二个参数代表了 props
    else {
      return createVNode(type, null, propsOrChildren)
    }
  }
  // 如果用户传递了三个或以上的参数，那么证明第二个参数一定代表了 props
  // ???为什么第二个参数一定代表了 props
  else {
    // 如果参数在三个以上，则从第二个参数开始，把后续所有参数都作为 children
    if (l > 3) {
      children = Array.prototype.slice.call(arguments, 2)
    }
    // 如果传递的参数只有三个，则 children 是单纯的 children
    else if (l === 3 && isVNode(children)) {
      children = [children]
    }
    // 触发 createVNode 方法，创建 VNode 实例
    return createVNode(type, propsOrChildren, children)
  }
}
