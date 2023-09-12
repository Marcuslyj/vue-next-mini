import { isFunction } from '@vue/shared';
import { Dep } from './dep';
import { ReactiveEffect } from './effect';
import { trackRefValue, triggerRefValue } from './ref';

export function computed(getterOrOptions: any) {
  let getter;

  const onlyGetter = isFunction(getterOrOptions);
  if (onlyGetter) getter = getterOrOptions;

  const cRef = new ComputedRefImpl(getter);
  return cRef;
}

export class ComputedRefImpl<T> {
  public dep?: Dep = undefined;
  private _value!: T;
  public readonly effect: ReactiveEffect<T>;
  public readonly __v_isRef = true;
  public _dirty: boolean = true;

  constructor(getter: () => T) {
    this.effect = new ReactiveEffect(getter, () => {
      // 数据变化，就标记 dirty
      if (!this._dirty) {
        this._dirty = true;
        triggerRefValue(this);
      }
    });
    this.effect.computed = this;
  }

  get value() {
    trackRefValue(this);
    if (this._dirty) {
      this._dirty = false;
      this._value = this.effect.run();
    }
    return this._value;
  }
}
