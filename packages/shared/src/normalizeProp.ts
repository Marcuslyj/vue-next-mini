import { isArray, isObject, isString } from '.';

export function normalizeClass(value: unknown): string {
  let res = '';

  if (isString(value)) {
    res = value;
  } else if (isArray(value)) {
    for (let index = 0; index < value.length; index++) {
      const normalized = normalizeClass(value[index]);
      if (normalized) {
        res += normalized + ' ';
      }
    }
  } else if (isObject(value)) {
    for (const name in value as Record<string, any>) {
      if ((value as Record<string, any>)[name]) {
        res += name + ' ';
      }
    }
  }
  return res.trim();
}
