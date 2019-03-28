import { useMemo, useCallback } from 'react';

export default function useLocalStorageCache(key) {
  key = `simple-cache-${key}`;
  const value = useMemo(() => {
    let v = localStorage.getItem(key);
    if (!v) return null;
    const index = v.indexOf(':');
    const type = v.slice(0, index);
    v = v.slice(index + 1);
    if (type === 'object') {
      return JSON.parse(v);
    }
    return v;
  }, []);
  const set = useCallback(v => {
    if (!v) {
      localStorage.removeItem(key);
      return;
    }
    switch (typeof v) {
      case 'string':
        v = `string:${v}`;
        break;
      case 'object':
        v = `object:${JSON.stringify(v)}`;
        break;
      default:
        throw Error('Unsupported type useLocalStorageCache set');
    }
    localStorage.setItem(key, v);
  });
  return [value, set];
}
