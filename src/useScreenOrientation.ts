import * as React from 'react';

export {};

declare global {
	interface ScreenOrientation {
		lock(orientation: ScreenOrientationLock): Promise<void>;
		unlock(): void;
	}

	type ScreenOrientationLock =
		| 'any'
		| 'natural'
		| 'portrait'
		| 'landscape'
		| 'portrait-primary'
		| 'portrait-secondary'
		| 'landscape-primary'
		| 'landscape-secondary';
}

type OrientationType =
	| 'portrait-primary'
	| 'portrait-secondary'
	| 'landscape-primary'
	| 'landscape-secondary';

export interface UseScreenOrientationReturn {
	/**
	 * Current orientation angle in degrees.
	 */
	angle: number | null;

	/**
	 * Whether the Screen Orientation API is supported.
	 */
	isSupported: boolean;

	/**
	 * Locks the screen orientation.
	 */
	lock: (orientation: ScreenOrientationLock) => Promise<void>;

	/**
	 * Current orientation type (e.g. portrait-primary).
	 */
	type: OrientationType | null;

	/**
	 * Unlocks the screen orientation.
	 */
	unlock: () => void;
}

/**
 * `useScreenOrientation` provides unopinionated access to the Screen Orientation API.
 * It exposes current orientation state and helpers to lock/unlock orientation without imposing UI decisiones.
 *
 * @example
 * ```tsx
 * const orientation = useScreenOrientation();
 *
 * if (orientation.type === 'landscape-primary') {
 *   // adapt layout
 * }
 * ```
 *
 * @author Sebastian Marat Urdanegui Bisalaya <https://sebastianurdanegui.com>
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Screen_Orientation_API
 * @since 0.0.1
 * @version 0.0.1
 *
 */
export function useScreenOrientation(): UseScreenOrientationReturn {
	const isSupported =
		typeof screen !== 'undefined' && screen.orientation !== undefined;
	const [type, setType] = React.useState<OrientationType | null>(
		isSupported ? screen.orientation.type : null
	);
	const [angle, setAngle] = React.useState<number | null>(
		isSupported ? screen.orientation.angle : null
	);

	const lock = React.useCallback(
		async (orientation: ScreenOrientationLock) => {
			if (!isSupported) return;
			await screen.orientation.lock(orientation);
		},
		[isSupported]
	);

	const unlock = React.useCallback(() => {
		if (!isSupported) return;
		screen.orientation.unlock();
	}, [isSupported]);

	React.useEffect(() => {
		if (!isSupported) return;
		const handleChange = () => {
			setType(screen.orientation.type);
			setAngle(screen.orientation.angle);
		};
		screen.orientation.addEventListener('change', handleChange);
		return () => {
			screen.orientation.removeEventListener('change', handleChange);
		};
	}, [isSupported]);

	return {
		angle,
		isSupported,
		lock,
		type,
		unlock,
	};
}
