import { isArray, isObject } from '../../shared/src';
import { createVNode, isVNode, VNode } from '../../shared/src/vnode';

export function h(type: any, propsOrChildren?: any, children?: any): VNode {
  const l = arguments.length;
  if (l === 2) {
    if (isObject(propsOrChildren) && !isArray(propsOrChildren)) {
      // vnode, 用作 children
      if (isVNode(propsOrChildren)) {
        return createVNode(type, null, [propsOrChildren]);
      }
      // 否则，用作 props
      return createVNode(type, propsOrChildren, []);
    } else {
      // 其他情况（数组或者非对象），用作 children
      return createVNode(type, null, propsOrChildren);
    }
  } else {
    if (l > 3) {
      // 为什么截掉前二？第二个一定是props 吗？
      children = Array.prototype.slice.call(arguments, 2);
    } else if (l === 3 && isVNode(children)) {
      children = [children];
    }
    return createVNode(type, propsOrChildren, children);
  }
}
