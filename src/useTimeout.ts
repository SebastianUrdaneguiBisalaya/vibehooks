import * as React from 'react';

export interface UseTimeoutOptions {
	/**
	 * Delay in milliseconds before the callback is executed.
	 * If null or undefined, the timeout won't be set.
	 */
	delay: number | null;
	/**
	 * Whether the timeout should start immediately on mount.
	 * @default true
	 */
	startOnMount?: boolean;
}

export interface UseTimeoutReturn {
	/**
	 * Cancel the pending timeout.
	 */
	cancel: () => void;
	/**
	 * Whether the timeout is currently active.
	 */
	isActive: boolean;
	/**
	 * Reset the timeout (cancel and start again).
	 */
	reset: () => void;
	/**
	 * Start or restart the timeout.
	 */
	start: () => void;
}

/**
 * `useTimeout` is a custom hook for managing timeouts in a declarative way. It's sever-safe and unopinionated about when/how to trigger the timeout.
 *
 * @example
 * ```tsx
 * // Auto-start timeout
 * const timeout = useTimeout(() => {
 *   console.log('Executed after 2 seconds');
 * }, { delay: 2000 });
 *
 * // Manual control
 * const timeout = useTimeout(() => {
 *   showNotification('Session expired');
 * }, { delay: 5000, startOnMount: false });
 *
 * // Start manually
 * <button onClick={timeout.start}>Start Timer</button>
 * <button onClick={timeout.cancel}>Cancel</button>
 * <button onClick={timeout.reset}>Reset</button>
 * ```
 *
 * @author Sebastian Marat Urdanegui Bisalaya <https://sebastianurdanegui.com>
 *
 * @version 0.0.1
 *
 */
export function useTimeout(
	callback: () => void,
	{ delay, startOnMount = true }: UseTimeoutOptions
): UseTimeoutReturn {
	const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
	const callbackRef = React.useRef(callback);
	const [isActive, setIsActive] = React.useState<boolean>(false);

	React.useEffect(() => {
		callbackRef.current = callback;
	}, [callback]);

	const cancel = React.useCallback(() => {
		if (timeoutRef.current !== null) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
			setIsActive(false);
		}
	}, []);

	const start = React.useCallback(() => {
		cancel();
		if (delay === null || delay === undefined) {
			return;
		}
		setIsActive(true);
		timeoutRef.current = setTimeout(() => {
			callbackRef.current();
			timeoutRef.current = null;
			setIsActive(false);
		}, delay);
	}, [delay, cancel]);

	const reset = React.useCallback(() => {
		cancel();
		start();
	}, [cancel, start]);

	React.useEffect(() => {
		if (startOnMount) {
			start();
		}
		return cancel;
	}, [startOnMount, start, cancel]);

	return {
		cancel,
		isActive,
		reset,
		start,
	};
}
