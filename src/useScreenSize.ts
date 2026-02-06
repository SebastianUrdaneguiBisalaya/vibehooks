import * as React from 'react';

export interface ScreenSizeReturn {
	height: number;
	width: number;
}

/**
 * `useScreenSize` returns the current screen size.
 *
 * @example
 * ```tsx
 * const { width, height } = useScreenSize();
 * ```
 *
 * @author Sebastian Marat Urdanegui Bisalaya <https://sebastianurdanegui.com>
 *
 * @version 0.0.1
 *
 */
export function useScreenSize(): ScreenSizeReturn {
	const [size, setSize] = React.useState<ScreenSizeReturn>({
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
