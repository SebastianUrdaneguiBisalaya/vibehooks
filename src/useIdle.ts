import * as React from 'react';

export interface UseIdleOptions {
	/**
	 * Events that reset the idle timer.
	 * @default ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll']
	 */
	events?: readonly (keyof WindowEventMap)[];

	/**
	 * Initial idle state.
	 * Useful for SSR or background tabs.
	 * @default false
	 */
	initialState?: boolean;

	/**
	 * Time in milliseconds before the user is considered idle.
	 * @default 60000
	 */
	timeout?: number;
}

export interface UseIdleReturn {
	/**
	 * Whether the user is currently idle.
	 */
	isIdle: boolean;

	/**
	 * Timestamp (ms) of the last detected user activity.
	 */
	lastActiveAt: number;
}

/**
 * `useIdle` is a React hook  to detect user inactivity.
 * It observes user interaction events and marks the user as idle after a specified period without activity.
 * This hook does not perform side effects (logout, pause, etc.).
 * It only exposes idle state so the consumer can decide what to do.
 *
 * @example
 * ```tsx
 * const { isIdle } = useIdle({ timeout: 30000 });
 *
 * if (isIdle) {
 *   // pause expensive work
 * }
 * ```
 *
 * @author Sebastian Marat Urdanegui Bisalaya <https://sebastianurdanegui.com>
 *
 * @since 0.0.1
 * @version 0.0.1
 *
 */
export function useIdle(options: UseIdleOptions = {}): UseIdleReturn {
	const {
		events = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll'],
		initialState = false,
		timeout = 60_000,
	} = options;

	const isBrowser = typeof window !== 'undefined';

	const [isIdle, setIsIdle] = React.useState<boolean>(initialState);
	const lasActiveRef = React.useRef<number>(Date.now());

	const timeoutRef = React.useRef<number | null>(null);

	const resetTimer = React.useCallback(() => {
		lasActiveRef.current = Date.now();

		setIsIdle(prev => (prev ? false : prev));

		if (timeoutRef.current !== null) {
			window.clearTimeout(timeoutRef.current);
		}
		timeoutRef.current = window.setTimeout(() => {
			setIsIdle(true);
		}, timeout);
	}, [timeout]);

	React.useEffect(() => {
		if (!isBrowser) return;
		resetTimer();
		for (const event of events) {
			window.addEventListener(event, resetTimer, { passive: true });
		}
		return () => {
			if (timeoutRef.current !== null) {
				window.clearTimeout(timeoutRef.current);
			}
			for (const event of events) {
				window.removeEventListener(event, resetTimer);
			}
		};
	}, [events, isBrowser, resetTimer]);

	return {
		isIdle,
		lastActiveAt: lasActiveRef.current,
	};
}
