import { mutableHandlers } from './baseHandlers';

export const reactiveMap = new WeakMap<object, any>();

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
  proxyMap.set(target, proxy);
  return proxy;
}
