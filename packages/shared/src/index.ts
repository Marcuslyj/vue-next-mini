export const isObject = (val: unknown) =>
  val !== null && typeof val === 'object';

export const hasChanged = (value: any, oldValue: any): boolean =>
  !Object.is(value, oldValue);

export const isFunction = (value: unknown): value is Function =>
  typeof value === 'function';
