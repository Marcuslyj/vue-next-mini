import { isOn } from '@vue/shared'
import { patchClass } from './modules/class'

/**
 * 为 prop 进行打补丁操作
 */
export const patchProp = (el, key, prevValue, nextValue) => {
  if (key === 'class') {
    patchClass(el, nextValue)
  }
  // else if (key === 'style') {
  //   // style
  //   // patchStyle(el, prevValue, nextValue)
  // } else if (isOn(key)) {
  //   // 事件
  //   // patchEvent(el, key, prevValue, nextValue)
  // } else if (shouldSetAsProp(el, key)) {
  //   // 通过 DOM Properties 指定
  //   // patchDOMProp(el, key, nextValue)
  // } else {
  //   // 其他属性
  //   // patchAttr(el, key, nextValue)
  // }
}
