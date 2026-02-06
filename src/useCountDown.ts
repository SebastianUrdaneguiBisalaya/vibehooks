import * as React from 'react';

export type CountDownStatus = 'start' | 'running' | 'paused' | 'completed';

export interface CountDownOptions {
	/**
	 * The interval en milliseconds between each tick.
	 */
	interval?: number;

	/**
	 * A callback to be called when the countdown ends.
	 */
	onComplete?: () => void;

	/**
	 * A callback to be called on each tick.
	 */
	onTick?: (time: number) => void;
}

export interface CountDown {
	/**
	 * The end time of the countdown in milliseconds.
	 */
	endTime: number;

	/**
	 *
	 */
	options?: CountDownOptions;

	/**
	 * Whether to start the countdown on mount. Default: false.
	 */
	startOnMount?: boolean;
}

export interface CountDownControlls {
	/**
	 * Increments the countdown by a given amount of time in milliseconds.
	 */
	increment: (ms?: number) => void;

	/**
	 *  Pauses the countdown.
	 */
	pause: () => void;

	/**
	 * Resets the countdown.
	 */
	reset: () => void;

	/**
	 * Resumes the countdown
	 */
	resume: () => void;

	/**
	 * Starts the countdown.
	 */
	start: () => void;
}

export interface CountDownReturn {
	/**
	 * Stable references to control functions.
	 */
	controls: CountDownControlls;

	/**
	 * Remaining time in milliseconds.
	 * Will be `0` when the countdown has completed.
	 */
	count: number | null;

	/**
	 * Indicates the status of the countdown.
	 */
	status: CountDownStatus;
}

/**
 * `useCountDown` is a controllable countdown hook based on an absolute end timestamp.
 * It uses a reference timestamp approach to prevent time drift commonly association with simple `setInterval` forcing.
 *
 * @author Sebastian Marat Urdanegui Bisalaya <https://sebastianurdanegui.com>
 *
 * @see https://developer.mozilla.org/es/docs/Web/API/Window/setInterval
 * @version 0.0.1
 *
 */
export function useCountDown({
	endTime,
	options,
	startOnMount = false,
}: CountDown): CountDownReturn {
	const intervalValue = options?.interval ?? 1000;

	const initialDurationRef = React.useRef<number>(endTime - Date.now());
	const endTimeRef = React.useRef<number>(
		startOnMount ? Date.now() + initialDurationRef.current : 0
	);
	const completedRef = React.useRef<boolean>(false);
	const remainingAtPauseRef = React.useRef<number>(initialDurationRef.current);
	const intervalIdRef = React.useRef<ReturnType<typeof setInterval> | null>(
		null
	);
	const optionsRef = React.useRef(options);

	React.useEffect(() => {
		optionsRef.current = options;
	}, [options]);

	const [count, setCount] = React.useState<number | null>(
		initialDurationRef.current
	);

	const [status, setStatus] = React.useState<CountDownStatus>(
		startOnMount ? 'running' : 'start'
	);

	const clearTimer = React.useCallback(() => {
		if (intervalIdRef.current !== null) {
			clearInterval(intervalIdRef.current);
			intervalIdRef.current = null;
		}
	}, []);

	const tick = React.useCallback(() => {
		const remaining = Math.max(endTimeRef.current - Date.now(), 0);
		optionsRef.current?.onTick?.(remaining);
		setCount(remaining);

		if (remaining <= 0 && !completedRef.current) {
			completedRef.current = true;
			clearTimer();
			setStatus('completed');
			optionsRef.current?.onComplete?.();
		}
	}, [clearTimer]);

	const pause = React.useCallback(() => {
		if (status !== 'running') return;
		clearTimer();
		const currentRemaining = Math.max(endTimeRef.current - Date.now(), 0);
		remainingAtPauseRef.current = currentRemaining;
		setStatus('paused');
	}, [status, clearTimer]);

	const resume = React.useCallback(() => {
		if (status !== 'paused') return;
		endTimeRef.current = Date.now() + remainingAtPauseRef.current;
		setStatus('running');
	}, [status]);

	const reset = React.useCallback(() => {
		clearTimer();
		completedRef.current = false;
		remainingAtPauseRef.current = initialDurationRef.current;
		setCount(initialDurationRef.current);
		setStatus('start');
	}, [clearTimer]);

	const increment = React.useCallback(
		(ms?: number) => {
			if (!ms || ms <= 0 || completedRef.current) return;
			endTimeRef.current += ms;
			if (status === 'paused') {
				remainingAtPauseRef.current += ms;
				setCount(remainingAtPauseRef.current);
			}
		},
		[status]
	);

	const start = React.useCallback(() => {
		if (status !== 'start') return;
		endTimeRef.current = Date.now() + remainingAtPauseRef.current;
		setStatus('running');
	}, [status]);

	React.useEffect(() => {
		if (status !== 'running') {
			clearTimer();
			return;
		}
		completedRef.current = false;
		tick();
		intervalIdRef.current = setInterval(tick, intervalValue);
		return clearTimer;
	}, [status, intervalValue, tick, clearTimer]);

	const controls = React.useMemo<CountDownControlls>(
		() => ({
			increment,
			pause,
			reset,
			resume,
			start,
		}),
		[start, pause, resume, reset, increment]
	);

	return {
		controls,
		count,
		status,
	};
}
