import * as React from 'react';

export interface UseLocalStorageOptions<T> {
  /**
   * Optional fallback value returned when the key does not exist or parsing fails.
   */
  fallback?: T;
}

export interface UseLocalStorageReturn<T> {
  /**
   * Reads and parses a value from localStorage.
   */
  get(): T | null;

  /**
   * Serializes and stores a value in localStorage.
   */
  set(value: T): void;

  /**
   * Removes the key from localStorage.
   */
  remove(): void;

  /**
   * Clears all localStorage entries.
   */
  clear(): void;

  /**
   * Updates the stored value using a functional updater.
   */
  update(updater: (prev: T | null) => T): void;
}

/**
 * `useLocalStorage` is a React hook that provides a typed, unopinionated API for interacting with `window.localStorage`.
 *
 * @template T Type of the stored value.
 * @param key Key of the item to store.
 * @param options Optional configuration.
 *
 * @returns A set of imperative helpers for interacting with localStorage.
 *
 * @example
 * ```tsx
 * const storage = useLocalStorage<User>('user', {
 *   fallback: null,
 * });
 *
 * const saveUser = () => {
 *   storage.set({ id: '1', name: 'Sebas' });
 * };
 *
 * const user = storage.get();
 * ```
 *
 * @author Sebastian Marat Urdanegui Bisalaya <https://sebastianurdanegui.com>
 *
 * @since 0.0.1
 * @version 0.0.1
 *
 */
export function useLocalStorage<T>(
  key: string,
  options?: UseLocalStorageOptions<T>,
): UseLocalStorageReturn<T> {
  const fallback = options?.fallback ?? null;
  const isSupported = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

  const get = React.useCallback((): T | null => {
    if (!isSupported) return fallback;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return fallback;
      return JSON.parse(raw) as T;
    } catch (error: unknown) {
        return fallback;
    }
  },[key, fallback, isSupported]);

  const set = React.useCallback(
    (value: T) => {
      if (!isSupported) return;
      window.localStorage.setItem(key, JSON.stringify(value));
    }, [key, isSupported]
  );

  const remove = React.useCallback(() => {
    if (!isSupported) return;
    window.localStorage.removeItem(key);
  }, [key, isSupported]);

  const clear = React.useCallback(() => {
    if (!isSupported) return;
    window.localStorage.clear();
  }, [isSupported]);

  const update = React.useCallback(
    (updater: (prev: T | null) => T) => {
      const current = get();
      const next = updater(current);
      set(next);
    }, [get, set]
  );

  return {
    get,
    set,
    remove,
    clear,
    update,
  }
}
