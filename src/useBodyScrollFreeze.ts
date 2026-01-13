import * as React from 'react';

type ScrollAxis = 'x' | 'y' | 'both';

export interface BodyScrollFreezeOptions {
	/**
	 * Axis to freeze.
	 * - 'x'    → horizontal scroll
	 * - 'y'    → vertical scroll
	 * - 'both' → horizontal and vertical scroll
	 *
	 * @default 'y'
	 */
	axis?: ScrollAxis;
}

export interface BodyScrollFreezeReturn {
	freeze: (options?: BodyScrollFreezeOptions) => void;
}

/**
 * `useBodyScrollFreeze` is an unopinionated React hook that provides an imperative API to disable body scrolling on one or both axes.
 * The hook captures the original `overflowX` and `overflowY` values and restores them exactly when the component is unmounted.
 *
 * The hook does not automatically lock scrolling; consumers decide
 * when and how to apply it.
 *
 * @returns {BodyScrollFreezeReturn}
 *
 * @example
 * ```tsx
 * const { freeze } = useBodyScrollFreeze();
 *
 * freeze(); // freezes vertical scroll (default)
 * freeze({ axis: 'both' });
 * freeze({ axis: 'x' });
 * ```
 *
 * @author Sebastian Marat Urdanegui Bisalaya <https://sebastianurdanegui.com>
 *
 * @since 0.0.1
 * @version 0.0.1
 *
 */
export function useBodyScrollFreeze(): BodyScrollFreezeReturn {
	const originalStyles = React.useRef<{
		overflowX: string;
		overflowY: string;
		position: string;
		top: string;
		width: string;
		scrollY: number;
	} | null>(null);

	const freeze = React.useCallback((options?: BodyScrollFreezeOptions) => {
		if (typeof window === 'undefined') return;

		const axis = options?.axis ?? 'y';
		const body = document.body;

		if (!originalStyles.current) {
			originalStyles.current = {
				overflowX: body.style.overflowX,
				overflowY: body.style.overflowY,
				position: body.style.position,
				top: body.style.top,
				width: body.style.width,
				scrollY: window.scrollY,
			};
		}
		body.style.position = 'fixed';
		body.style.top = `-${originalStyles.current.scrollY}px`;
		body.style.width = '100%';

		if (axis === 'x' || axis === 'both') {
			body.style.overflowX = 'hidden';
		}
		if (axis === 'y' || axis === 'both') {
			body.style.overflowY = 'hidden';
		}
	}, []);

	React.useEffect(() => {
		return () => {
			if (typeof window === 'undefined') return;
			if (!originalStyles.current) return;
			const body = document.body;
			const { overflowX, overflowY, position, top, width, scrollY } =
				originalStyles.current;

			body.style.position = position;
			body.style.top = top;
			body.style.width = width;
			body.style.overflowX = overflowX;
			body.style.overflowY = overflowY;
			window.scrollTo(0, scrollY);
		};
	}, []);

	return {
		freeze,
	};
}
