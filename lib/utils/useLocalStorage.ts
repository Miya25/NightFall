'use client';

import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';

export function useLocalStorageState<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw != null) {
        setState(JSON.parse(raw));
      }
    } catch {}
  }, [key]);

  const setAndStore: Dispatch<SetStateAction<T>> = useCallback((value) => {
    setState((prev) => {
      const next = value instanceof Function ? value(prev) as T : value;
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, [key]);

  return [state, setAndStore];
}


