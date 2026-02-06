import * as React from 'react';

type Listener = () => void;

function createSystemLanguageStore() {
	const listeners = new Set<Listener>();
	let listening = false;

	function emit() {
		listeners.forEach(listener => listener());
	}

	function subscribe(listener: Listener) {
		listeners.add(listener);
		if (!listening && typeof window !== 'undefined') {
			window.addEventListener('languagechange', emit);
			listening = true;
		}
		return () => {
			listeners.delete(listener);
			if (listeners.size === 0 && listening) {
				window.removeEventListener('languagechange', emit);
				listening = false;
			}
		};
	}

	function getSnapshot(): string {
		if (typeof window === 'undefined') return 'en';
		return window.navigator.language;
	}

	function getServerSnapshot(): string {
		return 'en';
	}

	return {
		getServerSnapshot,
		getSnapshot,
		subscribe,
	} as const;
}

export const systemLanguageStore = createSystemLanguageStore();

function createUserLanguageStore() {
	const listeners = new Set<Listener>();
	const storageKey = 'preferred-language';
	let listening = false;

	function emit() {
		listeners.forEach(listener => listener());
	}

	function subscribe(listener: Listener) {
		listeners.add(listener);
		if (!listening && typeof window !== 'undefined') {
			const onStorage = (event: StorageEvent) => {
				if (event.key === storageKey) emit();
			};
			window.addEventListener('storage', onStorage);
			listening = true;
			return () => {
				listeners.delete(listener);
				if (listeners.size === 0) {
					window.removeEventListener('storage', onStorage);
					listening = false;
				}
			};
		}
		return () => listeners.delete(listener);
	}

	function getSnapshot(): string {
		if (typeof window === 'undefined') return 'en';
		return localStorage.getItem(storageKey) ?? 'en';
	}

	function getServerSnapshot(): string {
		return 'en';
	}

	function setLanguage(lang: string) {
		if (typeof window === 'undefined') return;
		localStorage.setItem(storageKey, lang);
		emit();
	}

	return {
		getServerSnapshot,
		getSnapshot,
		setLanguage,
		subscribe,
	} as const;
}

export const userLanguageStore = createUserLanguageStore();

export interface PreferredLanguageReturn {
	/**
	 * Language effectively used by the application.
	 */
	language: string;

	/**
	 * Updates the user-selected language.
	 */
	setUserLanguage: (lang: string) => void;

	/**
	 * System / browser language.
	 */
	systemLanguage: string;

	/**
	 * User-selected language, if any.
	 */
	userLanguage: string | null;
}

/**
 * `usePreferredLanguage` is a custom React hook that resolves the effective language for the application.
 * This hook is SSR-safe and unopinionated.
 *
 * @example
 * ```tsx
 * function LanguageSelector() {
 *   const {
 *     language,
 *     userLanguage,
 *     systemLanguage,
 *     setUserLanguage,
 *   } = useResolvedLanguage();
 *
 *   return (
 *     <div>
 *       <p>Resolved: {language}</p>
 *       <p>System: {systemLanguage}</p>
 *       <p>User: {userLanguage ?? 'system default'}</p>
 *
 *       <button onClick={() => setUserLanguage('en')}>
 *         English
 *       </button>
 *
 *       <button onClick={() => setUserLanguage('es-PE')}>
 *         Español
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 *
 * @author Sebastian Marat Urdanegui Bisalaya <https://sebastianurdanegui.com>
 *
 * @version 0.0.1
 *
 */
export function usePreferredLanguage(): PreferredLanguageReturn {
	const systemLanguage = React.useSyncExternalStore(
		systemLanguageStore.subscribe,
		systemLanguageStore.getSnapshot,
		systemLanguageStore.getServerSnapshot
	);

	const userLanguage = React.useSyncExternalStore(
		userLanguageStore.subscribe,
		userLanguageStore.getSnapshot,
		userLanguageStore.getServerSnapshot
	);

	const resolved = userLanguage || systemLanguage || 'en';

	return {
		language: resolved,
		setUserLanguage: userLanguageStore.setLanguage,
		systemLanguage,
		userLanguage: userLanguage ?? null,
	};
}
