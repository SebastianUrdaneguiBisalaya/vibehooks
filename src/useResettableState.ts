import * as React from 'react';

/**
 * `useResettableState` is a React state hook with an explicit reset mechanism.
 *
 * @example
 * ```tsx
 * const [count, setCount, reset] = useResettableState(0);
 * ```
 */
export function useResettableState<T>(
	initialState: T | (() => T)
): readonly [T, React.Dispatch<React.SetStateAction<T>>, () => void] {
	const initialRef = React.useRef<T>(
		initialState instanceof Function ? initialState() : initialState
	);
	const [state, setState] = React.useState<T>(initialState);

	const reset = React.useCallback(() => {
		setState(
			typeof initialRef.current === 'function'
				? (initialRef.current as () => T)()
				: initialRef.current
		);
	}, []);

	return [state, setState, reset] as const;
}
