import { queuePreFlushCb } from '@vue/runtime-core';
import { EMPTY_OBJ, hasChanged, isObject } from '@vue/shared';
import { ReactiveEffect } from 'packages/reactivity/src/effect';
import { isReactive } from 'packages/reactivity/src/reactive';

export interface WatchOptions<immediate = boolean> {
  immediate?: immediate;
  deep?: boolean;
}

export function watch(source, cb: Function, options?: WatchOptions) {
  return doWatch(source, cb, options);
}

function doWatch(
  source,
  cb: Function,
  { immediate, deep }: WatchOptions = EMPTY_OBJ
) {
  let getter: () => any;

  // ref呢？
  if (isReactive(source)) {
    getter = () => source;
    deep = true;
  } else {
    // 不是 reactive
    getter = () => {};
  }

  if (cb && deep) {
    const baseGetter = getter;
    getter = () => traverse(baseGetter());
  }

  let oldValue = {};
  const job = () => {
    if (cb) {
      const newValue = effect.run();
      if (deep || hasChanged(newValue, oldValue)) {
        cb(newValue, oldValue);
        oldValue = newValue;
      }
    }
  };
  let scheduler = () => queuePreFlushCb(job);

  const effect = new ReactiveEffect(getter, scheduler);

  if (cb) {
    if (immediate) {
      job();
    } else {
      // 这里的 oldValue有问题吧？返回的是同一个对象
      oldValue = effect.run();
    }
  } else {
    effect.run();
  }
  return () => {
    effect.stop();
  };
}

export function traverse(value: unknown) {
  if (!isObject(value)) return value;

  for (const key in value as Record<string, unknown>) {
    traverse((value as Record<string, unknown>)[key]);
  }

  return value;
}
