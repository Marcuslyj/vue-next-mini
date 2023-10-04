import { ShapeFlags } from 'packages/shared/src/shapeFlags';
import { Fragment } from './vnode';

export interface RendererOptions {
  /**
   * 为指定的 element 的 props 打补丁
   */
  patchProp(
    el: Element,
    key: string,
    prevVal: any,
    nextVal: any,
    prevValue: any,
    nextValue: any
  ): void;
  /**
   * 为指定的 element 设置 text
   */
  setElementText(node: Element, text: string): void;
  insert(el, parent: Element, anchor?): void;
  createElement(type: string);
}

export function createRenderer(options: RendererOptions) {
  return baseCreateRenderer(options);
}

function baseCreateRenderer(options: RendererOptions) {
  const patch = (oldVNode, newVNode, container, anchor?) => {
    if (oldVNode === newVNode) {
      return;
    }

    const { type, shapeFlag } = newVNode;

    switch (type) {
      case Text:
        break;
      case Comment:
        break;
      case Fragment:
        break;
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
        } else if (shapeFlag & ShapeFlags.COMPONENT) {
        }
    }
  };

  const render = (vnode, container) => {
    if (vnode == null) {
      // TODO:卸载
    } else {
      patch(container._vnode || null, vnode, container);
    }
    container._vnode = vnode;
  };
}
