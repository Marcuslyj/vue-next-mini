import { extend } from '@vue/shared';
import { ComputedRefImpl } from './computed';
import { createDep, Dep } from './dep';

export type EffectScheduler = (...args: any[]) => any;
type KeyToDepMap = Map<any, Dep>;

export interface ReactiveEffectOptions {
  lazy?: boolean;
  scheduler?: EffectScheduler;
}
/**
 * key: 响应式对象
 * value：Map 对象{
 *  key: 响应式对象的指定属性
 *  value：指定对象的指定属性的执行函数
 * }
 */
const targetMap = new WeakMap<any, KeyToDepMap>();

export function effect<T = any>(fn: () => T, options?: ReactiveEffectOptions) {
  const _effect = new ReactiveEffect(fn);

  if (options) {
    extend(_effect, options); // options merge 到 effect 中， scheduler 等
  }

  // 完成第一次 fn 函数的执行，懒执行
  if (!options || !options.lazy) {
    _effect.run();
  }
}

export let activeEffect: ReactiveEffect | undefined;
export class ReactiveEffect<T = any> {
  computed?: ComputedRefImpl<T>;
  constructor(
    public fn: () => T,
    public scheduler: EffectScheduler | null = null
  ) {}

  run() {
    // 全局定义当前激活的 ReactiveEffect 实例
    activeEffect = this;
    // 执行 fn 会触发 getter
    return this.fn();
  }

  stop() {}
}

/**
 * 收集依赖（建立被依赖数据和副作用函数的关联关系）
 * 需要知道这个fn 函数是哪个响应式数据的哪个属性触发的
 * @param target
 * @param key
 */
export function track(target: object, key: unknown) {
  // console.log('收集依赖', target, key);
  if (!activeEffect) return;
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }

  let dep = depsMap.get(key);
  if (!dep) depsMap.set(key, (dep = createDep()));

  trackEffects(dep);
}

/**
 * 利用 dep依次跟踪指定 key的所有effect
 */
export function trackEffects(dep: Dep) {
  dep.add(activeEffect!);
}

export function trigger(target: object, key: unknown, newValue: unknown) {
  // console.log('触发更新', target, key, newValue);
  const depsMap = targetMap.get(target);
  if (!depsMap) return;

  const dep = depsMap.get(key);
  if (!dep) return;

  triggerEffects(dep);
}

/**
 * 依次触发 dep 中保存的依赖（者）
 */
export function triggerEffects(dep: Dep) {
  const effects = Array.isArray(dep) ? dep : [...dep];

  // 先执行计算属性的effect，防止进入死循环
  for (const effect of effects) {
    if (effect.computed) {
      triggerEffect(effect);
    }
  }
  for (const effect of effects) {
    if (!effect.computed) {
      triggerEffect(effect);
    }
  }
}

/**
 * 触发指定依赖（者）
 */
export function triggerEffect(effect: ReactiveEffect) {
  if (effect.scheduler) {
    effect.scheduler();
  } else {
    effect.run();
  }
}
