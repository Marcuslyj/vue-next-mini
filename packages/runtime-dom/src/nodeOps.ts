export const nodeOps = {
  insert: (child, parent, anchor) => {
    parent.insertBefore(child, anchor || null);
  },
  createElement: (tag): Element => {
    return document.createElement(tag);
  },
  setElementText: (el: Element, text) => {
    el.textContent = text;
  },
  remove: (child: Element) => {
    const parent = child.parentNode;
    if (parent) {
      parent.removeChild(child);
    }
  },
  createText: (text: string) => document.createTextNode(text),
  setText(node, text: string) {
    node.nodeValue = text;
  },
  createComment: (text: string) => document.createComment(text)
};
