import { isArray, isFunction, isObject, isString } from '../../shared/src';
import { ShapeFlags } from '../../shared/src/shapeFlags';

export interface VNode {
  __v_isVNode: true;
  type: any;
  props: any;
  children: any;
  shapeFlag: number;
}

export function isVNode(value: any): value is VNode {
  return value && value.__v_isVNode === true;
}

export function createVNode(type, props, children) {
  // dom类型
  const shapeFlag = isString(type)
    ? ShapeFlags.ELEMENT // 字符串，就是 element
    : isObject(type) // // 对象，就是 component
    ? ShapeFlags.STATEFUL_COMPONENT
    : 0;

  return createBaseVNode(type, props, children, shapeFlag);
}

function createBaseVNode(type, props, children, shapeFlag) {
  const vnode = {
    __v_isVNode: true,
    type,
    props,
    shapeFlag
  } as VNode;

  normalizeChildren(vnode, children);

  return vnode;
}

export function normalizeChildren(vnode: VNode, children: unknown) {
  let type = 0;

  // null||undefined
  if (children == null) {
    children = null;
  } else if (isArray(children)) {
    type = ShapeFlags.ARRAY_CHILDREN;
  } else if (typeof children === 'object') {
  } else if (isFunction(children)) {
  } else {
    // 基本数据类型
    children = String(children);
    type = ShapeFlags.TEXT_CHILDREN;
  }

  vnode.children = children;
  // dom类型叠加 children 类型
  vnode.shapeFlag |= type;
}
