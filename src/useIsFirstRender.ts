import * as React from 'react';

/**
 * `useIsFirstRender` returns true if the component is the first render.
 *
 * @example
 * ```tsx
 * const isFirstRender = useIsFirstRender();
 * ```
 */
export function useIsFirstRender(): boolean {
	const [isFirst, setIsFirst] = React.useState<boolean>(true);

	React.useEffect(() => {
		setIsFirst(false);
	}, []);

	return isFirst;
}
