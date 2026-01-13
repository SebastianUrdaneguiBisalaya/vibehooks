import * as React from 'react';

export type Theme = string;
export type Listener = () => void;

const listeners = new Set<Listener>();

function emit() {
	listeners.forEach(listener => listener());
}

export const systemThemeStore = {
	suscribe(listener: Listener) {
		listeners.add(listener);

		if (typeof window !== 'undefined') {
			const media = window.matchMedia('(prefers-color-scheme: dark)');
			const onChange = () => emit();
			media.addEventListener('change', onChange);
			return () => {
				listeners.delete(listener);
			};
		}

		return () => listeners.delete(listener);
	},
	getSnapshot(): Theme {
		if (typeof window === 'undefined') return 'light';
		return window.matchMedia('(prefers-color-scheme: dark)').matches
			? 'dark'
			: 'light';
	},
	getServerSnapshot(): Theme {
		return 'light';
	},
};

const storageKey = 'preferred-theme';

export const userThemeStore = {
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
	getSnapshot(): Theme | null {
		if (typeof window === 'undefined') return null;
		return localStorage.getItem(storageKey) ?? null;
	},
	getSeverSnapshot(): Theme | null {
		return null;
	},
	setTheme(theme: Theme | null) {
		if (typeof window === 'undefined') return;
		if (theme === null) {
			localStorage.removeItem(storageKey);
		} else {
			localStorage.setItem(storageKey, theme);
		}
		emit();
	},
};

export interface PreferredThemeReturn {
	/**
	 * Theme effectively used by the application.
	 */
	theme: Theme;

	/**
	 * User-selected theme, if any.
	 */
	userTheme: Theme | null;

	/**
	 * System / OS preferred theme.
	 */
	systemTheme: Theme;

	/**
	 * Sets a user-selected theme.
	 */
	setUserTheme: (theme: Theme | null) => void;

	/**
	 * Toggles between two themes.
	 * Defaults to 'light' and 'dark'.
	 */
	toggleTheme: (options?: { light?: Theme; dark?: Theme }) => void;
}

/**
 * `usePreferredTheme` resolves the effective theme for the application.
 * Resolution strategy:
 * 1. User-selected theme (if present)
 * 2. System theme (prefers-color-scheme)
 * 3. Fallback ('light')
 *
 * @returns {PreferredThemeReturn}
 *
 * @example
 * ```tsx
 * function ThemeSwitcher() {
 *    const {
 *        theme,
 *        systemTheme,
 *        userTheme,
 *        toggleTheme,
 *        setUserTheme
 *    } = usePreferredTheme();
 *
 *    return (
 *        <div>
 *            <p>Resolved: {theme}</p>
 *            <p>System: {systemTheme}</p>
 *            <p>User: {userTheme ?? 'system default'}</p>
 *
 *            <button onClick={() => toggleTheme()}>
 *                Toggle
 *            </button>
 *
 *            <button onClick={() => setUserTheme('dark')}>
 *                Force Dark
 *            </button>
 *
 *            <button onClick={() => setUserTheme(null)}>
 *                Reset to System
 *            </button>
 *        </div>
 *    );
 *}
 * ```
 *
 * @author Sebastian Marat Urdanegui Bisalaya <https://sebastianurdanegui.com>
 *
 * @since 0.0.1
 * @version 0.0.1
 *
 */
export function usePreferredTheme(): PreferredThemeReturn {
	const systemTheme = React.useSyncExternalStore(
		systemThemeStore.suscribe,
		systemThemeStore.getSnapshot,
		systemThemeStore.getServerSnapshot
	);

	const userTheme = React.useSyncExternalStore(
		userThemeStore.suscribe,
		userThemeStore.getSnapshot,
		userThemeStore.getSeverSnapshot
	);

	const resolved = userTheme ?? systemTheme ?? 'light';

	const toggleTheme = React.useCallback(
		(options?: { light?: Theme; dark?: Theme }) => {
			const light = options?.light ?? 'light';
			const dark = options?.dark ?? 'dark';

			const next = resolved === 'dark' ? light : dark;
			userThemeStore.setTheme(next);
		},
		[resolved]
	);

	return {
		theme: resolved,
		userTheme: userTheme ?? null,
		systemTheme,
		setUserTheme: userThemeStore.setTheme,
		toggleTheme,
	};
}
