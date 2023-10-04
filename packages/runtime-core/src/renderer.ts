import { ShapeFlags } from 'packages/shared/src/shapeFlags';
import { Fragment } from './vnode';

export interface RendererOptions {
  /**
   * 为指定的 element 的 props 打补丁
   */
  patchProp(el: Element, key: string, prevValue: any, nextValue: any): void;
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
  const {
    insert: hostInsert,
    patchProp: hostPatchProp,
    createElement: hostCreateElement,
    setElementText: hostSetElementText
  } = options;

  const processElement = (oldValue, newVNode, container, anchor) => {
    if (oldValue == null) {
      mountElement(newVNode, container, anchor);
    } else {
      // todo:更新操作
    }
  };

  const mountElement = (vnode, container, anchor) => {
    const { type, props, shapeFlag } = vnode;
    // 1.创建 element
    const el = (vnode.el = hostCreateElement(type));
    // 2.设置文本
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      hostSetElementText(el, vnode.children);
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    }
    // 3.设置 props
    if (props) {
      for (const key in props) {
        hostPatchProp(el, key, null, props[key]);
      }
    }
    // 4.插入
    hostInsert(el, container, anchor);
  };

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
          processElement(oldVNode, newVNode, container, anchor);
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
