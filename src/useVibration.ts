import * as React from 'react';

/**
 * Pattern accepted by the Vibration API.
 * A single duration in milliseconds or a vibration pattern array.
 */
export type VibrationPattern = number | number[];

export interface UseVibrationResult {
	/**
	 * Indicates whether the Vibration API is supported in the current execution environment.
	 */
	isSupported: boolean;

	/**
	 * Triggers a vibration with the given pattern.
	 * Returns `true` if the vibration request was accepted by the user agent, or `false` otherwise.
	 * Durring SSR or when unsupported, returns `false`.
	 */
	vibrate: (pattern: VibrationPattern) => boolean;

	/**
	 * Cancels any ongoing vibration.
	 * During SSR or when unsupported, does nothing.
	 */
	cancel: () => void;
}

/**
 * `useVibration` is a React hook to safely access the Vibration API in an unopinionated and SSR-safe manner.
 *
 *
 * @returns {UseVibrationResult} An object containing the support flag and vibration control methods.
 *
 * @example
 * ```tsx
 * function Example() {
 *   const { isSupported, vibrate, cancel } = useVibration();
 *
 *   if (!isSupported) {
 *     return <button disabled>Vibration not supported</button>;
 *   }
 *
 *   return (
 *     <>
 *       <button onClick={() => vibrate(200)}>
 *         Vibrate once
 *       </button>
 *       <button onClick={() => vibrate([100, 50, 100])}>
 *         Vibrate pattern
 *       </button>
 *       <button onClick={cancel}>
 *         Stop vibration
 *       </button>
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
export function useVibration(): UseVibrationResult {
	const isClient =
		typeof window !== 'undefined' && typeof navigator !== 'undefined';
	const isSupported = isClient && typeof navigator.vibrate === 'function';

	const vibrate = React.useCallback(
		(pattern: VibrationPattern): boolean => {
			if (!isSupported) return false;
			return navigator.vibrate(pattern);
		},
		[isSupported]
	);

	const cancel = React.useCallback((): void => {
		if (!isSupported) return;
		navigator.vibrate(0);
	}, [isSupported]);

	return {
		isSupported,
		vibrate,
		cancel,
	};
}
