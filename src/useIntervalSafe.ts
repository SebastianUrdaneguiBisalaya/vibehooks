import * as React from 'react';

export interface UseIntervalOptions {
	/**
	 * Delay in milliseconds between each interval execution.
	 * If null or undefined, the interval won't be set.
	 */
	delay: number | null;
	/**
	 * Maximum number of times to execute the callback.
	 * If undefined, runs indefinitely until cancelled.
	 */
	maxExecutions?: number;
	/**
	 * Whether the interval should start immediately on mount.
	 * @default true
	 */
	startOnMount?: boolean;
}

export interface UseIntervalReturn {
	/**
	 * Cancel the running interval.
	 */
	cancel: () => void;
	/**
	 * Number of times the callback has been executed.
	 */
	executionCount: number;
	/**
	 * Whether the interval is currently active.
	 */
	isActive: boolean;
	/**
	 * Reset the interval (cancel and start again, resetting execution count).
	 */
	reset: () => void;
	/**
	 * Start or restart the interval.
	 */
	start: () => void;
}

/**
 * `useInterval` is a custom hook for managing intervals in a declarative way. It's server safe and unopinionated about when/how to trigger the interval.
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
 */
export function useIntervalSafe(
	callback: () => void,
	{ delay, maxExecutions, startOnMount = true }: UseIntervalOptions
): UseIntervalReturn {
	const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
	const callbackRef = React.useRef<typeof callback>(callback);
	const executionsRef = React.useRef<number>(0);

	const [isActive, setIsActive] = React.useState<boolean>(false);
	const [executions, setExecutions] = React.useState<number>(0);

	React.useEffect(() => {
		callbackRef.current = callback;
	}, [callback]);

	const cancel = React.useCallback(() => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
		setIsActive(false);
	}, []);

	const tick = React.useCallback(() => {
		if (maxExecutions !== undefined && executionsRef.current >= maxExecutions) {
			cancel();
			return;
		}
		callbackRef.current();
		executionsRef.current += 1;
		setExecutions(executionsRef.current);
		if (maxExecutions !== undefined && executionsRef.current >= maxExecutions) {
			cancel();
		}
	}, [cancel, maxExecutions]);

	const start = React.useCallback(() => {
		if (delay == null || intervalRef.current) return;
		executionsRef.current = 0;
		setExecutions(0);
		setIsActive(true);
		intervalRef.current = setInterval(tick, delay);
	}, [delay, maxExecutions, tick]);

	const reset = React.useCallback(() => {
		cancel();
		start();
	}, [cancel, start]);

	React.useEffect(() => {
		if (!startOnMount) return;
		start();
		return cancel;
	}, [startOnMount]);

	return {
		cancel,
		executionCount: executions,
		isActive,
		reset,
		start,
	};
}
