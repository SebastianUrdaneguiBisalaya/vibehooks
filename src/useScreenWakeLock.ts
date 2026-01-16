import * as React from 'react';

export interface UseScreenWakeLockResult {
	/**
	 * Whether the wake lock is currently active.
	 */
	isActive: boolean;

	/**
	 * Requests a screen wake lock.
	 */
	request: () => Promise<void>;

	/**
	 * Releases the wake lock.
	 */
	release: () => Promise<void>;

	/**
	 * Whether the Wake Lock API is supported.
	 */
	isSupported: boolean;
}

/**
 * `useScreenWakeLock` provides unopinionated access to the Screen Wake Lock Web API.
 * It allows consumers to request and release a screen wake lock without imposing lifecycle or UI behavior.
 *
 * @returns Wake lock helpers and state.
 *
 * @example
 * ```tsx
 * const wakeLock = useScreenWakeLock();
 *
 * useEffect(() => {
 *   wakeLock.request();
 *   return () => wakeLock.release();
 * }, []);
 * ```
 *
 * @author Sebastian Marat Urdanegui Bisalaya <https://sebastianurdanegui.com>
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API
 * @since 0.0.1
 * @version 0.0.1
 *
 */
export function useScreenWakeLock(): UseScreenWakeLockResult {
	const isSupported =
		typeof navigator !== 'undefined' && 'wakeLock' in navigator;

	const lockRef = React.useRef<WakeLockSentinel | null>(null);
	const [isActive, setIsActive] = React.useState<boolean>(false);

	const request = React.useCallback(async () => {
		if (!isSupported || lockRef.current) return;
		try {
			lockRef.current = await navigator.wakeLock.request('screen');
			setIsActive(true);
			lockRef.current.addEventListener('release', () => {
				lockRef.current = null;
				setIsActive(false);
			});
		} catch {}
	}, [isSupported]);

	const release = React.useCallback(async () => {
		if (!lockRef.current) return;
		await lockRef.current.release();
		lockRef.current = null;
		setIsActive(false);
	}, []);

	return {
		isSupported,
		isActive,
		request,
		release,
	};
}
