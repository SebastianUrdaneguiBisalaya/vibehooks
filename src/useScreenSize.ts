import * as React from 'react';

export interface ScreenSize {
	width: number;
	height: number;
}

/**
 * `useScreenSize` returns the current screen size.
 *
 * @returns The current screen size.
 *
 * @example
 * ```tsx
 * const { width, height } = useScreenSize();
 * ```
 *
 * @author Sebastian Marat Urdanegui Bisalaya <https://sebastianurdanegui.com>
 *
 * @since 0.0.1
 * @version 0.0.1
 *
 */
export function useScreenSize(): ScreenSize {
	const [size, setSize] = React.useState<ScreenSize>({
		height: 0,
		width: 0,
	});
	React.useEffect(() => {
		const handleResize = () => {
			setSize({
				height: window.innerHeight,
				width: window.innerWidth,
			});
		};
		handleResize();
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);
	return size;
}
