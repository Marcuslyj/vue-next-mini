import { isArray, isFunction, isString } from '.';
import { ShapeFlags } from './shapeFlags';

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
  // 字符串，就是 ELEMENT，否则先置为 0
  const shapeFlag = isString(type) ? ShapeFlags.ELEMENT : 0;

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
  } else if (typeof children === 'object') {
  } else if (isFunction(children)) {
  } else {
    // 基本数据类型
    children = String(children);
    type = ShapeFlags.TEXT_CHILDREN;
  }

  vnode.children = children;
  vnode.shapeFlag |= type;
}
