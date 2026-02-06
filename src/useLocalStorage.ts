import * as React from 'react';

export interface UseLocalStorageOptions<T> {
	/**
	 * Fallback value returned when the key does not exist or parsing fails.
	 */
	fallback: T;
}

export interface UseLocalStorageReturn<T> {
	/**
	 * Removes the key from localStorage.
	 */
	remove(): void;

	/**
	 * Serializes and stores a value in localStorage.
	 */
	set(value: T): void;

	/**
	 * Updates the stored value using a functional updater.
	 */
	update(updater: (prev: T | null) => T): void;

	/**
	 * The current value of the key.
	 */
	value: T;
}

const listeners = new Set<() => void>();
const cache = new Map<string, unknown>();

function emit() {
	listeners.forEach(listener => listener());
}

function subscribe(listener: () => void) {
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
	};
}

function readFromStorage<T>(key: string, fallback: T): T {
	if (typeof window === 'undefined') return fallback;
	try {
		const raw = window.localStorage.getItem(key);
		return raw === null ? fallback : (JSON.parse(raw) as T);
	} catch {
		return fallback;
	}
}

/**
 * `useLocalStorage` is a React hook that provides a typed, unopinionated API for interacting with `window.localStorage`.
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
 * @see https://developer.mozilla.org/es/docs/Web/API/Window/localStorage
 */
export function useLocalStorage<T>(
	key: string,
	options: UseLocalStorageOptions<T>
): UseLocalStorageReturn<T> {
	const { fallback } = options;

	const getSnapshot = React.useCallback((): T => {
		if (!cache.has(key)) {
			cache.set(key, readFromStorage(key, fallback));
		}
		return cache.get(key) as T;
	}, [key, fallback]);

	const value = React.useSyncExternalStore(
		subscribe,
		getSnapshot,
		() => fallback
	);

	const set = React.useCallback(
		(next: T) => {
			if (typeof window === 'undefined') return;
			cache.set(key, next);
			window.localStorage.setItem(key, JSON.stringify(next));
			emit();
		},
		[key]
	);

	const update = React.useCallback(
		(updater: (prev: T) => T) => {
			set(updater(value));
		},
		[value, set]
	);

	const remove = React.useCallback(() => {
		if (typeof window === 'undefined') return;
		cache.delete(key);
		window.localStorage.removeItem(key);
		emit();
	}, [key]);

	return {
		remove,
		set,
		update,
		value,
	};
}
