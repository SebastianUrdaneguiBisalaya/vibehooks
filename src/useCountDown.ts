import * as React from 'react';

export interface CountDownOptions {
	/**
	 * The interval en miliseconds between each tick.
	 */
	interval: number;

	/**
	 * A callback to be called when the countdown ends.
	 */
	onComplete: () => void;

	/**
	 * A callback to be called on each tick.
	 */
	onTick: (time: number) => void;
}

export interface CountDown {
	/**
	 * The end time of the countdown in milliseconds.
	 */
	endTime: number;

	/**
	 *
	 */
	options: CountDownOptions;
}

export interface CountDownControlls {
	/**
	 *  Pauses the countdown.
	 */
	pause: () => void;

	/**
	 * Resumes the countdown.
	 */
	resume: () => void;

	/**
	 * Resets the countdown.
	 * If a new end time is provided, it will be used instead.
	 */
	reset: (newEndTime?: number) => void;
}

export interface CountDownReturn {
	/**
	 * Remaining time in milliseconds.
	 * Will be `0` when the countdown has completed.
	 */
	count: number;

	/**
	 * Indicates whether the countdown is currently paused.
	 */
	isPaused: boolean;

	/**
	 * Controls the countdown.
	 */
	controls: CountDownControlls;
}

/**
 * `useCountDown` is a controllable countdown hook based on an absolute end timestamp.
 *
 * Features:
 * - Pause / resume support without time drift
 * - Reset to initial or custom endTime
 * - Uses absolute time for accuracy
 * - Executes callbacks predictably
 * - Fully unopinionated and SSR-safe
 *
 * @param {CountDown} params Countdown configuration
 *
 * @returns {CountDownReturn}
 *
 * @example
 * ```tsx
 * function QuizTimer() {
 *   const {
 *     count,
 *     isPaused,
 *     controls
 *   } = useCountDown({
 *     endTime: Date.now() + 30_000,
 *     options: {
 *       interval: 1000,
 *       onComplete: () => alert('Time up!')
 *     }
 *   });
 *
 *   return (
 *     <>
 *       <p>{Math.ceil(count / 1000)}s</p>
 *       <button onClick={controls.pause}>Pause</button>
 *       <button onClick={controls.resume}>Resume</button>
 *       <button onClick={() => controls.reset()}>Reset</button>
 *     </>
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
export function useCountDown({ endTime, options }: CountDown): CountDownReturn {
	const interval = options?.interval ?? 1000;

	const initialEndTimeRef = React.useRef(endTime);
	const endTimeRef = React.useRef(endTime);

	const [count, setCount] = React.useState<number>(() => {
		return Math.max(endTime - Date.now(), 0);
	});

	const [isPaused, setIsPaused] = React.useState<boolean>(false);

	const completedRef = React.useRef(false);
	const intervalIdRef = React.useRef<number | null>(null);

	const clearTimer = () => {
		if (intervalIdRef.current !== null) {
			clearInterval(intervalIdRef.current);
			intervalIdRef.current = null;
		}
	};

	const tick = React.useCallback(() => {
		const remaining = Math.max(endTimeRef.current - Date.now(), 0);
		options?.onTick?.(remaining);
		setCount(remaining);

		if (remaining === 0 && !completedRef.current) {
			completedRef.current = true;
			clearTimer();
			options?.onComplete?.();
		}
	}, [options]);

	React.useEffect(() => {
		if (isPaused) return;
		completedRef.current = false;
		clearTimer();
		tick();
		intervalIdRef.current = window.setInterval(tick, interval);
		return clearTimer;
	}, [interval, isPaused, tick]);

	const pause = React.useCallback(() => {
		if (isPaused) return;
		setIsPaused(true);
		clearTimer();
	}, []);

	const resume = React.useCallback(() => {
		if (!isPaused) return;
		endTimeRef.current = Date.now() + count;
		setIsPaused(false);
	}, [count, isPaused]);

	const reset = React.useCallback((newEndTime?: number) => {
		clearTimer();
		completedRef.current = false;
		const nextEndTime = newEndTime ?? initialEndTimeRef.current;
		endTimeRef.current = nextEndTime;
		setCount(Math.max(nextEndTime - Date.now(), 0));
		setIsPaused(false);
	}, []);

	return {
		count,
		isPaused,
		controls: {
			pause,
			resume,
			reset,
		},
	};
}
