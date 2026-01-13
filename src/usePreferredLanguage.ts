import * as React from 'react';

type Listener = () => void;

const listeners = new Set<Listener>();

function emit() {
	listeners.forEach(listener => listener());
}

export const systemLanguageStore = {
	suscribe(listener: Listener) {
		listeners.add(listener);

		if (typeof window !== 'undefined') {
			window.addEventListener('languagechange', emit);
			return () => {
				listeners.delete(listener);
				window.removeEventListener('languagechange', emit);
			};
		}
		return () => listeners.delete(listener);
	},
	getSnapshot(): string {
		if (typeof window === 'undefined') return 'en';
		return navigator.language;
	},
	getServerSnapshot(): string {
		return 'en';
	},
};

const storageKey = 'preferred-language';

export const userLanguageStore = {
	suscribe(listener: Listener) {
		listeners.add(listener);

		if (typeof window !== 'undefined') {
			const onStorage = (event: StorageEvent) => {
				if (event.key === storageKey) emit();
			};
			window.addEventListener('storage', onStorage);
			return () => {
				listeners.delete(listener);
				window.removeEventListener('storage', onStorage);
			};
		}
		return () => listeners.delete(listener);
	},
	getSnapshot(): string {
		if (typeof window === 'undefined') return 'en';
		return localStorage.getItem(storageKey) ?? 'en';
	},
	getSeverSnapshot(): string {
		return '';
	},
	setLanguage(language: string) {
		if (typeof window === 'undefined') return;
		localStorage.setItem(storageKey, language);
		emit();
	},
};

export interface PreferredLanguageReturn {
	/**
	 * Language effectively used by the application.
	 */
	language: string;

	/**
	 * User-selected language, if any.
	 */
	userLanguage: string | null;

	/**
	 * System / browser language.
	 */
	systemLanguage: string;

	/**
	 * Updates the user-selected language.
	 */
	setUserLanguage: (lang: string) => void;
}

/**
 * `usePreferredLanguage` is a custom React hook that resolves the effective language for the application.
 *
 * Resolution strategy:
 * 1. User-selected language (if present)
 * 2. System language (navigator.language)
 * 3. Fallback ('en')
 *
 * This hook is SSR-safe and unopinionated.
 *
 * @returns {PreferredLanguageReturn}
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
 * @since 0.0.1
 * @version 0.0.1
 *
 */
export function usePreferredLanguage(): PreferredLanguageReturn {
	const systemLanguage = React.useSyncExternalStore(
		systemLanguageStore.suscribe,
		systemLanguageStore.getSnapshot,
		systemLanguageStore.getServerSnapshot
	);

	const userLanguage = React.useSyncExternalStore(
		userLanguageStore.suscribe,
		userLanguageStore.getSnapshot,
		userLanguageStore.getSeverSnapshot
	);

	const resolved = userLanguage || systemLanguage || 'en';

	return {
		language: resolved,
		userLanguage: userLanguage ?? null,
		systemLanguage,
		setUserLanguage: userLanguageStore.setLanguage,
	};
}
