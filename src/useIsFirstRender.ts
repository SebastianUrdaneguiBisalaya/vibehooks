import * as React from 'react';

/**
 * `useIsFirstRender` returns true if the component is the first render.
 *
 * @example
 * ```tsx
 * const isFirstRender = useIsFirstRender();
 * ```
 *
 * @author Sebastian Marat Urdanegui Bisalaya <https://sebastianurdanegui.com>
 *
 * @version 0.0.1
 *
 */
export function useIsFirstRender(): boolean {
	const [isFirst, setIsFirst] = React.useState<boolean>(true);

	React.useEffect(() => {
		setIsFirst(false);
	}, []);

	return isFirst;
}
