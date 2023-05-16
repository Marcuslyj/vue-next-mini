import { ComputedRefImpl } from './computed'
import { createDep, Dep } from './dep'
import { extend } from '@vue/shared'

export type EffectScheduler = (...args: any[]) => any
type KeyToDepMap = Map<any, Dep>
const targetMap = new WeakMap<any, KeyToDepMap>()

export interface ReactiveEffectOptions {
  lazy?: boolean
  scheduler?: EffectScheduler
}

export function effect<T = any>(fn: () => T, options?: ReactiveEffectOptions) {
  const _effect = new ReactiveEffect(fn)

  if (options) {
    extend(_effect, options)
  }

  if (!options || !options.lazy) {
    _effect.run()
  }
}

export let activeEffect: ReactiveEffect | undefined

export class ReactiveEffect<T = any> {
  computed?: ComputedRefImpl<T>

  constructor(
    public fn: () => T,
    public scheduler: EffectScheduler | null = null
  ) {}
  run() {
    activeEffect = this
    return this.fn()
  }
}

// 怎么感觉是收集（触发）副作用函数？？

/**
 * 收集依赖
 * @param target
 * @param key
 */
export function track(target: object, key: unknown) {
  console.log('track：收集依赖')
  if (!activeEffect) return

  let depsMap = targetMap.get(target)
  if (!depsMap) targetMap.set(target, (depsMap = new Map()))

  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, (dep = createDep()))
  }

  trackEffects(dep)
}

export function trackEffects(dep: Dep) {
  dep.add(activeEffect!)
}

/**
 * 触发依赖
 */
export function trigger(target: object, key: unknown, value: unknown) {
  console.log('trigger：触发依赖')
  const depsMap = targetMap.get(target)

  if (!depsMap) return
  const dep: Dep | undefined = depsMap.get(key)

  if (!dep) return
  triggerEffects(dep)
}

export function triggerEffects(dep: Dep) {
  const effects = Array.isArray(dep) ? dep : [...dep]

  // 先执行计算属性，后执行非计算属性，避免死循环
  for (const effect of effects) {
    if (effect.computed) {
      triggerEffect(effect)
    }
  }
  for (const effect of effects) {
    if (!effect.computed) {
      triggerEffect(effect)
    }
  }
}

export function triggerEffect(effect: ReactiveEffect) {
  if (effect.scheduler) {
    effect.scheduler()
  } else {
    effect.run()
  }
}
