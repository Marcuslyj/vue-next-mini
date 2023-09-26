import { isObject } from '@vue/shared';
import { mutableHandlers } from './baseHandlers';

export const reactiveMap = new WeakMap<object, any>();

export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive'
}

export function reactive(target: object) {
  return createReactiveObject(target, mutableHandlers, reactiveMap);
}

function createReactiveObject(
  target: object,
  baseHandlers: ProxyHandler<any>,
  proxyMap: WeakMap<object, any>
) {
  // 有缓存，直接返回
  const existingProxy = reactiveMap.get(target);
  if (existingProxy) return existingProxy;
  // 否则，新建并缓存返回
  const proxy = new Proxy(target, baseHandlers);
  proxy[ReactiveFlags.IS_REACTIVE] = true;
  proxyMap.set(target, proxy);
  return proxy;
}

export const toReactive = <T extends unknown>(value: T): T => {
  return isObject(value) ? reactive(value as object) : value;
};

export function isReactive(value: any): boolean {
  return !!(value && value[ReactiveFlags.IS_REACTIVE]);
}
