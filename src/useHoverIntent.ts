import * as React from 'react';

export interface UseHoverIntentOptions {
	/**
	 * Delay (ms) before considering hover as intentional.
	 */
	delay?: number;

	/**
	 * Pixel movement tolerance before canceling intent.
	 */
	tolerance?: number;
}

export interface UseHoverIntentResult {
	/**
	 * Whether the hover is considered intentional.
	 */
	isIntent: boolean;

	/**
	 * Event handlers to spread on the target element.
	 */
	handlers: {
		onMouseEnter?: React.MouseEventHandler;
		onMouseMove?: React.MouseEventHandler;
		onMouseLeave?: React.MouseEventHandler;
	};
}

/**
 * `useHoverIntent` detects whether a mouse hover is intentional by observing pointer movement and time spent over an element.
 * It is useful for preventing accidental hover interactions.
 *
 * @param options Hover intent configuration.
 *
 * @returns Hover intent state and event handlers.
 *
 * @example
 * ```tsx
 * const hover = useHoverIntent({ delay: 150, tolerance: 8 });
 *
 * return (
 *   <div {...hover.handlers}>
 *     {hover.isIntent && <Tooltip />}
 *   </div>
 * );
 * ```
 *
 * @author Sebastian Marat Urdanegui Bisalaya <https://sebastianurdanegui.com>
 *
 * @since 0.0.1
 * @version 0.0.1
 *
 */
export function useHoverIntent(
	options: UseHoverIntentOptions = {}
): UseHoverIntentResult {
	const { delay = 100, tolerance = 6 } = options;
	const [isIntent, setIsIntent] = React.useState<boolean>(false);

	const timeoutRef = React.useRef<number | null>(null);
	const lastPointRef = React.useRef<{ x: number; y: number } | null>(null);

	const clear = React.useCallback(() => {
		if (timeoutRef.current !== null) {
			window.clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
	}, []);

	const onMouseEnter = React.useCallback<React.MouseEventHandler>(
		event => {
			lastPointRef.current = { x: event.clientX, y: event.clientY };
			clear();
			timeoutRef.current = window.setTimeout(() => {
				setIsIntent(true);
			}, delay);
		},
		[delay, clear]
	);

	const onMouseMove = React.useCallback<React.MouseEventHandler>(
		event => {
			if (!lastPointRef.current) return;
			const dx = Math.abs(event.clientX - lastPointRef.current.x);
			const dy = Math.abs(event.clientY - lastPointRef.current.y);

			if (dx > tolerance || dy > tolerance) {
				clear();
				setIsIntent(false);
				timeoutRef.current = window.setTimeout(() => {
					setIsIntent(true);
				}, delay);
				lastPointRef.current = {
					x: event.clientX,
					y: event.clientY,
				};
			}
		},
		[tolerance, clear, delay]
	);

	const onMouseLeave = React.useCallback<React.MouseEventHandler>(() => {
		clear();
		lastPointRef.current = null;
		setIsIntent(false);
	}, [clear]);

	React.useEffect(() => {
		return () => {
			clear();
		};
	}, [clear]);

	return {
		isIntent,
		handlers: {
			onMouseEnter,
			onMouseMove,
			onMouseLeave,
		},
	};
}
