import { track, trigger } from './effect';

const get = createGetter();
function createGetter() {
  return function get(target: any, key: string | symbol, receiver: object) {
    // get值
    const res = Reflect.get(target, key, receiver);

    //  收集依赖
    track(target, key);

    return res;
  };
}

const set = createSetter();
function createSetter() {
  return function set(
    target: object,
    key: string | symbol,
    value: unknown,
    receiver: object
  ) {
    // set值
    const result = Reflect.set(target, key, value, receiver);

    //  触发副作用函数
    trigger(target, key, value);

    return result;
  };
}

export const mutableHandlers: ProxyHandler<object> = { get, set };
