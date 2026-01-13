import * as React from 'react';

/**
 * `useIsFirstRender` returns true if the component is the first render.
 *
 * @returns A boolean value indicating if the component is the first render.
 *
 * @example
 * ```tsx
 * const isFirstRender = useIsFirstRender();
 * ```
 *
 * @author Sebastian Marat Urdanegui Bisalaya <https://sebastianurdanegui.com>
 *
 * @since 0.0.1
 * @version 0.0.1
 *
 */
export function useIsFirstRender(): boolean {
	const isFirstRender = React.useRef(true);

	const value = isFirstRender.current;
	isFirstRender.current = false;

	return value;
}
