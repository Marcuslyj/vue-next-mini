import { isOn } from '@vue/shared';
import { patchAttr } from './modules/attr';
import { patchClass } from './modules/class';
import { patchDOMProp } from './modules/props';

export const patchProp = (el: Element, key, prevValue, nextValue) => {
  if (key === 'class') {
    patchClass(el, nextValue);
  } else if (key === 'style') {
  } else if (isOn(key)) {
  } else if (shouldSetAsProp(el, key)) {
    patchDOMProp(el, key, nextValue);
  } else {
    patchAttr(el, key, nextValue);
  }
};

function shouldSetAsProp(el: Element, key: string) {
  if (key === 'form') {
    return false;
  }

  if (key === 'list' && el.tagName === 'INPUT') {
    return false;
  }

  if (key === 'type' && el.tagName === 'TEXTAREA') {
    return false;
  }

  return key in el;
}
