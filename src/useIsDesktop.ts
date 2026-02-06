import * as React from 'react';

import { useScreenSize } from './useScreenSize';

/**
 * `useIsDesktop` returns true if the screen size is greater than or equal to the given width.
 *
 * @example
 * ```tsx
 * const isDesktop = useIsDesktop(1000);
 * ```
 */
export function useIsDesktop(width: number = 0): boolean {
	const screenSize = useScreenSize();
	const [isDesktop, setIsDesktop] = React.useState<boolean>(false);

	React.useEffect(() => {
		setIsDesktop(screenSize.width >= width);
	}, [screenSize.width, width]);
	return isDesktop;
}
