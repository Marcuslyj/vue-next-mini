import { EMPTY_OBJ } from '@vue/shared';
import { patchProp } from 'packages/runtime-dom/src/patchProp';
import { ShapeFlags } from 'packages/shared/src/shapeFlags';
import { Fragment, isSameVNodeType } from './vnode';

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
  remove(el: Element);
  createText(text: string);
  setText(node: Text, text: string): void;
}

export function createRenderer(options: RendererOptions) {
  return baseCreateRenderer(options);
}

function baseCreateRenderer(options: RendererOptions) {
  const {
    insert: hostInsert,
    patchProp: hostPatchProp,
    createElement: hostCreateElement,
    setElementText: hostSetElementText,
    remove: hostRemove,
    createText: hostCreateText,
    setText: hostSetText
  } = options;

  const processText = (oldVNode, newVNode, container, anchor) => {
    if (oldVNode == null) {
      newVNode.el = hostCreateText(newVNode.children as string);
      hostInsert(newVNode.el, container, anchor);
    } else {
      const el = (newVNode.el = oldVNode.el);
      if (newVNode.children !== oldVNode.children) {
        hostSetText(el, newVNode.children as string);
      }
    }
  };

  const processElement = (oldVNode, newVNode, container, anchor) => {
    if (oldVNode == null) {
      // 挂载操作
      mountElement(newVNode, container, anchor);
    } else {
      // 更新操作
      patchElement(oldVNode, newVNode);
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

  const patchElement = (oldVNode, newVNode) => {
    const el = (newVNode.el = oldVNode.el);
    const oldProps = oldVNode.props || EMPTY_OBJ;
    const newProps = newVNode.props || EMPTY_OBJ;

    patchChildren(oldVNode, newVNode, el, null);
    patchProps(el, newVNode, oldProps, newProps);
  };

  const patchChildren = (oldVNode, newVNode, container, anchor) => {
    const c1 = oldVNode && oldVNode.children;
    const prevShapeFlag = oldVNode ? oldVNode.shapeFlag : 0;
    const c2 = newVNode && newVNode.children;
    const { shapeFlag } = newVNode;
    // 新节点是文本节点
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // 卸载旧子节点
      }
      // 作为文本节点来处理
      if (c1 !== c2) {
        // 挂载新子节点的文本
        hostSetElementText(container, c2);
      }
    } else {
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // 新旧子节点都是数组
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          // diff
        } else {
          // 卸载
        }
      } else {
        if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
          // 删除旧节点的 text
          hostSetElementText(container, '');
        }
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          // 单独新子节点的挂载
        }
      }
    }
  };

  const patchProps = (el: Element, vnode, oldProps, newProps) => {
    if (oldProps !== newProps) {
      for (const key in newProps) {
        const prev = oldProps[key];
        const next = newProps[key];
        if (prev !== next) {
          // 更新属性
          hostPatchProp(el, key, prev, next);
        }
      }
      // 清掉旧的多余的 props
      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!(key in newProps)) {
            hostPatchProp(el, key, oldProps[key], null);
          }
        }
      }
    }
  };

  const patch = (oldVNode, newVNode, container, anchor?) => {
    if (oldVNode === newVNode) {
      return;
    }

    if (oldVNode && !isSameVNodeType(oldVNode, newVNode)) {
      unmount(oldVNode);
      oldVNode = null;
    }

    const { type, shapeFlag } = newVNode;

    switch (type) {
      case Text:
        processText(oldVNode, newVNode, container, anchor);
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

  const unmount = (vnode) => {
    hostRemove(vnode.el);
  };

  const render = (vnode, container) => {
    if (vnode == null) {
      // 卸载
      if (container._vnode) {
        unmount(container._vnode);
      }
    } else {
      patch(container._vnode || null, vnode, container);
    }
    container._vnode = vnode;
  };

  return {
    render
  };
}
