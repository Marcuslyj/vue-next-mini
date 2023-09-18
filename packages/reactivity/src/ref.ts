import { hasChanged } from '@vue/shared';
import { ComputedRefImpl } from './computed';
import { createDep, Dep } from './dep';
import { activeEffect, trackEffects, triggerEffects } from './effect';
import { toReactive } from './reactive';

export interface Ref<T = any> {
  value: T;
}

export function ref(value?: unknown) {
  return createRef(value, false);
}

function createRef(rawValue: unknown, shallow: boolean) {
  if (isRef(rawValue)) {
    return rawValue;
  }
  return new RefImpl(rawValue, shallow);
}

export function isRef(r: any): r is Ref {
  return !!(r && r.__v_isRef === true);
}

class RefImpl<T> {
  private _value: T;
  private _rawValue: T;
  public dep?: Dep = undefined;
  public readonly __v_isRef = true;

  constructor(value: T, public readonly __v_isShallow: boolean) {
    this._rawValue = value;
    // __v_isShallow理解成简单数据类型
    this._value = __v_isShallow ? value : toReactive(value);
  }

  get value() {
    // 收集依赖
    trackRefValue(this); // 复杂数据类型为什么需要这个操作？set value的时候，需要 手动trigger！
    return this._value;
  }

  set value(newVal) {
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal;
      this._value = toReactive(newVal);
      triggerRefValue(this);
    }
  }
}

/**
 * 收集依赖
 */
export function trackRefValue(ref: RefImpl<any> | ComputedRefImpl<any>) {
  if (activeEffect) {
    trackEffects(ref.dep || (ref.dep = createDep()));
  }
}

/**
 * 触发依赖
 */
export function triggerRefValue(ref: RefImpl<any> | ComputedRefImpl<any>) {
  if (ref.dep) {
    triggerEffects(ref.dep);
  }
}
