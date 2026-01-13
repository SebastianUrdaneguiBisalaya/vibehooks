import * as React from 'react';

import { useScreenSize } from './useScreenSize';

/**
 * `useIsDesktop` returns true if the screen size is greater than or equal to the given width.
 *
 * @param width Width to compare with the screen size.
 *
 * @returns A boolean value indicating if the screen size is greater than or equal to the given width.
 *
 * @example
 * ```tsx
 * const isDesktop = useIsDesktop(1000);
 * ```
 *
 * @author Sebastian Marat Urdanegui Bisalaya <https://sebastianurdanegui.com>
 *
 * @since 0.0.1
 * @version 0.0.1
 *
 */
export function useIsDesktop(width: number = 0): boolean {
	const screenSize = useScreenSize();
	const [isDesktop, setIsDesktop] = React.useState<boolean>(false);

	React.useEffect(() => {
		setIsDesktop(screenSize.width >= width);
	}, [screenSize.width, width]);
	return isDesktop;
}
