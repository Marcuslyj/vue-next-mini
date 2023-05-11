// 怎么感觉是收集（触发）副作用函数？？

/**
 * 收集依赖
 * @param target
 * @param key
 */
export function track(target: object, key: unknown) {
  console.log('track：收集依赖')
}

/**
 * 触发依赖
 */
export function trigger(target: object, key: unknown, value: unknown) {
  console.log('trigger：触发依赖')
}
