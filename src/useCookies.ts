import * as React from 'react';

export interface UseCookieOptions {
	path?: string;
	domain?: string;
	maxAge?: number;
	expires?: Date;
	secure?: boolean;
	sameSite?: 'strict' | 'lax' | 'none';
}

export interface UseCookieReturn {
	/**
	 * Reads a cookie value.
	 */
	get: (name: string) => string | null;

	/**
	 * Sets a cookie value.
	 */
	set: (name: string, value: string, options?: UseCookieOptions) => void;

	/**
	 * Removes a cookie.
	 */
	remove: (name: string, options?: UseCookieOptions) => void;

	/**
	 * Reads all cookies as a key-value map.
	 */
	getAll: () => Record<string, string>;
}

/**
 * `useCookies` is a React hook that provides unopinionated access to document cookies.
 * This hook does not sync cookies to React state and does not perform encoding beyond basic string handling.
 *
 * @returns Cookie helpers.
 *
 * @example
 * ```tsx
 *  const cookies = useCookies();
 * cookies.set('token', 'abc', { secure: true });
 * const token = cookies.get('token');
 * ```
 *
 * @author Sebastian Marat Urdanegui Bisalaya <https://sebastianurdanegui.com>
 *
 * @since 0.0.1
 * @version 0.0.1
 *
 */
export function useCookies(): UseCookieReturn {
	const isSupported =
		typeof document !== 'undefined' && typeof document.cookie !== 'undefined';
	const get = React.useCallback(
		(name: string) => {
			if (!isSupported) return null;
			const cookies = document.cookie.split('; ');
			for (const cookie of cookies) {
				const [key, ...rest] = cookie.split('=');
				if (key === name) {
					return decodeURIComponent(rest.join('='));
				}
			}
			return null;
		},
		[isSupported]
	);

	const set = React.useCallback(
		(name: string, value: string, options: UseCookieOptions = {}) => {
			if (!isSupported) return;
			let cookie = `${name}=${encodeURIComponent(value)}`;
			if (options.maxAge !== undefined) {
				cookie += `; max-age=${options.maxAge}`;
			}
			if (options.expires !== undefined) {
				cookie += `; expires=${options.expires.toUTCString()}`;
			}
			if (options.path) cookie += `; path=${options.path}`;
			if (options.domain) cookie += `; domain=${options.domain}`;
			if (options.secure) cookie += '; secure';
			if (options.sameSite) cookie += `; samesite=${options.sameSite}`;
			document.cookie = cookie;
		},
		[isSupported]
	);

	const remove = React.useCallback(
		(name: string, options: UseCookieOptions = {}) => {
			set(name, '', {
				...options,
				maxAge: 0,
			});
		},
		[set]
	);

	const getAll = React.useCallback(() => {
		if (!isSupported) return {};
		return document.cookie
			.split('; ')
			.filter(Boolean)
			.reduce<Record<string, string>>((acc, cookie) => {
				const [key, ...rest] = cookie.split('=');
				if (!key) return acc;
				acc[key] = decodeURIComponent(rest.join('='));
				return acc;
			}, {});
	}, [isSupported]);

	return {
		get,
		set,
		remove,
		getAll,
	};
}
