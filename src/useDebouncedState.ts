import * as React from 'react';

export interface UseDebouncedStateOptions {
	/**
	 * Delay in milliseconds before the debounced value is updated.
	 */
	delay: number;
}

export interface UseDebouncedStateReturn<T> {
	/**
	 * The inmediate (non-debounced) value.
	 */
	value: T;

	/**
	 * The debounced value, updated after the specified delay.
	 */
	debouncedValue: T;

	/**
	 * State setter for the inmediate value.
	 */
	setValue: React.Dispatch<React.SetStateAction<T>>;
}

/**
 * `useDebouncedState` is a React hook that manages a state value and exposes a debounced version of it.
 * The debounced value is updated only after the specified delay has elapsed since the last change to the inmediate value.
 *
 * @template T Type of the state value.
 * @param optons Hook configuration options.
 *
 * @returns An object containing the inmediate value, the debounced value, and a setter for the inmediate value.
 *
 * @example
 * ```tsx
 * const { value, debouncedValue, setValue } = useDebouncedState('', {
 * delay: 400,
 * });
 * React.useEffect(() => {
 *   if (!debouncedValue) return;
 *   search(debouncedValue);
 * }, [debouncedValue]);
 * return (
 *   <input
 *     value={value}
 *     onChange={(e) => setValue(e.target.value)}
 *   />
 * );
 * ```
 *
 * @author Sebastian Marat Urdanegui Bisalaya <https://sebastianurdanegui.com>
 *
 * @since 0.0.1
 * @version 0.0.1
 *
 */
export function useDebouncedState<T>(
	initialValue: T,
	options: UseDebouncedStateOptions
): UseDebouncedStateReturn<T> {
	const { delay } = options;
	const [value, setValue] = React.useState<T>(initialValue);
	const [debouncedValue, setDebouncedValue] = React.useState<T>(initialValue);

	const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

	React.useEffect(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		timeoutRef.current = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [value, delay]);

	return {
		value,
		debouncedValue,
		setValue,
	};
}
