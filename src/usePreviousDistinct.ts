import * as React from 'react';

/**
 * `usePreviousDistinct` is a React hook that returns the previous value of a state variable, but only if it is different from the current value.
 *
 * @example
 * ```tsx
 * const prevUserId = usePreviousDistinct(userId);
 * ```
 *
 * @author Sebastian Marat Urdanegui Bisalaya <https://sebastianurdanegui.com>
 *
 * @version 0.0.1
 *
 */
export function usePreviousDistinct<T>(value: T): T | undefined {
	const prevRef = React.useRef<T | undefined>(undefined);
	const currentRef = React.useRef<T | undefined>(undefined);

	if (!Object.is(value, currentRef.current)) {
		prevRef.current = currentRef.current;
		currentRef.current = value;
	}
	return prevRef.current;
}
