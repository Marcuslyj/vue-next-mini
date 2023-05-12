type KeyToDepMap = Map<any, ReactiveEffect>
const targetMap = new WeakMap<any, KeyToDepMap>()

export function effect<T = any>(fn: () => T) {
  const _effect = new ReactiveEffect(fn)
  _effect.run()
}

export let activeEffect: ReactiveEffect | undefined

export class ReactiveEffect<T = any> {
  constructor(public fn: () => T) {}
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

  depsMap.set(key, activeEffect)
}

/**
 * 触发依赖
 */
export function trigger(target: object, key: unknown, value: unknown) {
  console.log('trigger：触发依赖')

  const depsMap = targetMap.get(target)

  if (!depsMap) return
  const effect = depsMap.get(key) as ReactiveEffect

  if (!effect) return
  effect.fn()
}
