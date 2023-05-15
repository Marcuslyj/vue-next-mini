import { Dep } from './dep'
import { isFunction } from '@vue/shared'
import { ReactiveEffect } from './effect'
import { trackRefValue, triggerRefValue } from './ref'

export function computed(getterOrOptions: unknown) {
  let getter

  const onlyGetter = isFunction(getterOrOptions)
  if (onlyGetter) {
    getter = getterOrOptions
  }

  const cRef = new ComputedRefImpl(getter)

  return cRef
}

export class ComputedRefImpl<T> {
  public dep?: Dep = undefined
  private _value!: T
  public readonly effect: ReactiveEffect<T>
  public readonly __v_isRef = true
  public _dirty: boolean = true

  constructor(getter) {
    this.effect = new ReactiveEffect(
      getter,
      //依赖变化时候，都要标记为脏，然后手动触发computed的更新
      // datas relied on change => dirty true => triggerRefValue
      () => {
        console.log('sche...')
        if (!this._dirty) {
          this._dirty = true
          triggerRefValue(this)
        }
      }
    )
    this.effect.computed = this
  }

  get value() {
    trackRefValue(this)
    // 脏的时候再重新计算值
    if (this._dirty) {
      this._dirty = false
      this._value = this.effect.run()
    }
    return this._value
  }
}
