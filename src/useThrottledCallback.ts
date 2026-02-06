import * as React from 'react';

export interface UseThrottledCallbackOptions {
	/**
	 * Minimum time in milliseconds between callback executions.
	 */
	delay: number;
}

export type ThrottledCallbackReturn<TArgs extends readonly unknown[]> = (
	...args: TArgs
) => void;

/**
 * `useThrottledCallback` is a React hook that returns a throttled version of a callback.
 * The throttled callback will execute at most once every `delay` milliseconds, regardless of how many times it is invoked.
 *
 * @example
 * ```tsx
 * * const onScroll = useThrottledCallback(
 *   (y: number) => {
 *     console.log(y);
 *   },
 *   { delay: 200 }
 * );
 *
 * React.useEffect(() => {
 *   const handler = () => onScroll(window.scrollY);
 *   window.addEventListener('scroll', handler);
 *
 *   return () => window.removeEventListener('scroll', handler);
 * }, [onScroll]);
 * ```
 *
 * @author Sebastian Marat Urdanegui Bisalaya <https://sebastianurdanegui.com>
 *
 * @version 0.0.1
 *
 */
export function useThrottledCallback<TArgs extends readonly unknown[]>(
	callback: (...args: TArgs) => void,
	options: UseThrottledCallbackOptions
): ThrottledCallbackReturn<TArgs> {
	const { delay } = options;

	const lastCallRef = React.useRef<number>(0);
	const callbackRef = React.useRef<ThrottledCallbackReturn<TArgs>>(callback);

	React.useEffect(() => {
		callbackRef.current = callback;
	}, [callback]);

	return React.useCallback(
		(...args: TArgs) => {
			const now = Date.now();
			if (now - lastCallRef.current >= delay) {
				lastCallRef.current = now;
				callbackRef.current(...args);
			}
		},
		[delay]
	);
}
