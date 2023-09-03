export function effect<T = any>(fn: () => T) {
  const _effect = new ReactiveEffect(fn);
  // 完成第一次 fn 函数的执行
  _effect.run();
}

export let activeEffect: ReactiveEffect | undefined;
export class ReactiveEffect<T = any> {
  constructor(public fn: () => T) {}

  run() {
    activeEffect = this;
    return this.fn();
  }
}

/**
 * 收集依赖（建立被依赖数据和副作用函数的关联关系）
 * @param target
 * @param key
 */
export function track(target: string, key: unknown) {
  console.log('收集依赖', target, key);
}

export function trigger(target: object, key: unknown, newValue: unknown) {
  console.log('触发更新', target, key, newValue);
}
