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
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Screen_Orientation_API
 */
export function useScreenOrientation(): UseScreenOrientationReturn {
	const isWindow = typeof window !== 'undefined';
	const orientation =
		isWindow && 'orientation' in screen ? screen.orientation : null;
	const isSupported =
		!!orientation &&
		typeof orientation.lock === 'function' &&
		typeof orientation.unlock === 'function';
	const [type, setType] = React.useState<OrientationType | null>(
		orientation?.type ?? null
	);
	const [angle, setAngle] = React.useState<number | null>(
		orientation?.angle ?? null
	);

	const lock = React.useCallback(
		async (orientationLock: ScreenOrientationLock) => {
			if (!isSupported || !orientation) return;
			try {
				await orientation.lock(orientationLock);
			} catch (error) {
				console.warn('Orientation lock failed:', error);
			}
		},
		[isSupported, orientation]
	);

	const unlock = React.useCallback(() => {
		if (!isSupported || !orientation) return;
		try {
			orientation.unlock();
		} catch (error) {
			console.warn('Orientation unlock failed:', error);
		}
	}, [isSupported, orientation]);

	React.useEffect(() => {
		if (!orientation) return;
		const handleChange = () => {
			setType(orientation.type);
			setAngle(orientation.angle);
		};
		orientation.addEventListener('change', handleChange);
		return () => {
			orientation.removeEventListener('change', handleChange);
		};
	}, [orientation]);

	return {
		angle,
		isSupported,
		lock,
		type,
		unlock,
	};
}
