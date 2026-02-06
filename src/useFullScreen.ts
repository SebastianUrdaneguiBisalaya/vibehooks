import * as React from 'react';

export interface FullScreenReturn {
	enter: () => Promise<void>;
	exit: () => Promise<void>;
	isFullscreen: boolean;
	toggle: () => Promise<void>;
}

/**
 * `useFullScreen` controls the browser Fullscreen API.
 *
 * @example
 * ```tsx
 * const { isFullscreen, enter, exit, toggle } = useFullscreen<HTMLDivElement>(ref);
 * ```
 */
export function useFullscreen<T extends HTMLElement>(
	ref: React.RefObject<T | null>
): FullScreenReturn {
	const [isFullscreen, setIsFullscreen] = React.useState<boolean>(false);

	const enter = React.useCallback(async () => {
		if (!ref.current) return;
		if (document.fullscreenElement) return;
		await ref.current.requestFullscreen();
	}, []);

	const exit = React.useCallback(async () => {
		if (!document.fullscreenElement) return;
		await document.exitFullscreen();
	}, []);

	const toggle = React.useCallback(async () => {
		if (document.fullscreenElement) {
			await exit();
		} else {
			await enter();
		}
	}, [enter, exit]);

	React.useEffect(() => {
		const handleChange = () => {
			setIsFullscreen(Boolean(document.fullscreenElement));
		};

		document.addEventListener('fullscreenchange', handleChange);
		return () => document.removeEventListener('fullscreenchange', handleChange);
	}, []);

	return {
		enter,
		exit,
		isFullscreen,
		toggle,
	};
}
