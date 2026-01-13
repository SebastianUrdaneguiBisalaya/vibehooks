import * as React from 'react';

export interface UseIntervalOptions {
	/**
	 * Delay in milliseconds between each interval execution.
	 * If null or undefined, the interval won't be set.
	 */
	delay: number | null;
	/**
	 * Whether the interval should start immediately on mount.
	 * @default true
	 */
	startOnMount?: boolean;
	/**
	 * Whether to execute the callback immediately before starting the interval.
	 * @default false
	 */
	executeImmediately?: boolean;
	/**
	 * Maximum number of times to execute the callback.
	 * If undefined, runs indefinitely until cancelled.
	 */
	maxExecutions?: number;
}

export interface UseIntervalReturn {
	/**
	 * Start or restart the interval.
	 */
	start: () => void;
	/**
	 * Cancel the running interval.
	 */
	cancel: () => void;
	/**
	 * Reset the interval (cancel and start again, resetting execution count).
	 */
	reset: () => void;
	/**
	 * Whether the interval is currently active.
	 */
	isActive: boolean;
	/**
	 * Number of times the callback has been executed.
	 */
	executionCount: number;
}

/**
 * `useInterval` is a custom hook for managing intervals in a declarative way. It's server safe and unopinionated about when/how to trigger the interval.
 *
 * @param callback - The function to be executed on each interval tick.
 * @param options - An object containing the following properties:
 *   - `delay`: The delay in milliseconds between each interval tick.
 *   - `startOnMount`: Whether the interval should start immediately on mount.
 *   - `executeInmediately`: Whether to execute the callback inmediately before starting the interval.
 *.  - `maxExecutions`: The maximum number of times to execute the callback. If undefined, runs indefinitely until cancelled.
 * @returns API for controlling the interval
 *
 * @example
 * ```tsx
 * // Auto-start interval
 * const interval = useInterval(() => {
 *   console.log('Executed every 1 second');
 * }, { delay: 1000 });
 *
 * // Manual control with execution limit
 * const interval = useInterval(
 *   () => fetchData(),
 *   {
 *     delay: 5000,
 *     startOnMount: false,
 *     maxExecutions: 10
 *   }
 * );
 *
 * <button onClick={interval.start}>Start Polling</button>
 * <button onClick={interval.cancel}>Stop</button>
 * <span>Polled {interval.executionCount} times</span>
 * ```
 *
 * @author Sebastian Marat Urdanegui Bisalaya <https://sebastianurdanegui.com>
 *
 * @since 0.0.1
 * @version 0.0.1
 *
 */
export function useIntervalSafe(
	callback: () => void,
	{
		delay,
		startOnMount = true,
		executeImmediately = false,
		maxExecutions,
	}: UseIntervalOptions
): UseIntervalReturn {
	const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
	const callbackRef = React.useRef(callback);
	const [isActive, setIsActive] = React.useState<boolean>(false);
	const [executions, setExecutions] = React.useState<number>(0);

	React.useEffect(() => {
		callbackRef.current = callback;
	}, [callback]);

	const cancel = React.useCallback(() => {
		if (intervalRef.current !== null) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
			setIsActive(false);
		}
	}, []);

	const start = React.useCallback(() => {
		cancel();
		if (delay === null || delay === undefined) return;
		if (executeImmediately) {
			callbackRef.current();
			setExecutions(1);
			if (maxExecutions === 1) return;
		} else {
			setExecutions(0);
		}
		setIsActive(true);
		intervalRef.current = setInterval(() => {
			setExecutions(prevCount => {
				const newCount = prevCount + 1;
				if (maxExecutions !== undefined && newCount >= maxExecutions) {
					cancel();
					return newCount;
				}
				callbackRef.current();
				return newCount;
			});
		}, delay);
	}, [delay, cancel, executeImmediately]);

	const reset = React.useCallback(() => {
		cancel();
		setExecutions(0);
		start();
	}, []);

	React.useEffect(() => {
		if (startOnMount) {
			start();
		}
		return cancel;
	}, [startOnMount, start, cancel]);

	return {
		start,
		cancel,
		reset,
		isActive,
		executionCount: executions,
	};
}
