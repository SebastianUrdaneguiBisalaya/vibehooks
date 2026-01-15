import * as React from 'react';

export type GeolocationPermissionState = PermissionState | 'unsupported';

export interface UseGeolocationResult {
	/**
	 * Indicates whether the Geolocation API is supported.
	 */
	isSupported: boolean;

	/**
	 * Current permission state for geolocation.
	 * - 'granted'
	 * - 'denied'
	 * - 'prompt'
	 * - 'unsupported' (Permissions API not available)
	 */
	permissionState: GeolocationPermissionState;

	/**
	 * Latest known position.
	 */
	position: GeolocationPosition | null;

	/**
	 * Latest geolocation error.
	 */
	error: GeolocationPositionError | null;

	/**
	 * Requests the current position once.
	 */
	getCurrentPosition: (options?: PositionOptions) => void;

	/**
	 * Starts watching position changes.
	 */
	watchPosition: (options?: PositionOptions) => number | null;

	/**
	 * Clears a watcher.
	 */
	clearWatch: (watcherId: number) => void;
}

/**
 * `useGeolocation` is a React hook to safely access the Geolocation API in an unopinionated and SSR-safe manner.
 *
 * @returns {UseGeolocationResult} An object containing the support flag and geolocation control methods.
 *
 * @example
 * ```tsx
 *
 * ```
 *
 * @author Sebastian Marat Urdanegui Bisalaya <https://sebastianurdanegui.com>
 *
 * @since 0.0.1
 * @version 0.0.1
 *
 */
export function useGeolocation(): UseGeolocationResult {
	const isClient =
		typeof window !== 'undefined' && typeof navigator !== 'undefined';
	const isSupported = isClient && 'geolocation' in navigator;

	const [position, setPosition] = React.useState<GeolocationPosition | null>(
		null
	);
	const [error, setError] = React.useState<GeolocationPositionError | null>(
		null
	);
	const [permissionState, setPermissionState] =
		React.useState<GeolocationPermissionState>(
			isClient && 'permissions' in navigator ? 'prompt' : 'unsupported'
		);

	React.useEffect(() => {
		if (!isClient || !('permissions' in navigator) || !isSupported) return;
		let status: PermissionStatus | null = null;

		navigator.permissions
			.query({ name: 'geolocation' })
			.then(permissionStatus => {
				status = permissionStatus;
				setPermissionState(permissionStatus.state);
				permissionStatus.onchange = () => {
					setPermissionState(permissionStatus.state);
				};
			})
			.catch(() => {
				setPermissionState('unsupported');
			});

		return () => {
			if (status) {
				status.onchange = null;
			}
		};
	}, [isClient, isSupported]);

	const getCurrentPosition = React.useCallback(
		(options?: PositionOptions): void => {
			if (!isSupported) return;
			navigator.geolocation.getCurrentPosition(
				position => {
					setPosition(position);
					setError(null);
				},
				err => {
					setError(err);
					setPosition(null);
				},
				options
			);
		},
		[isSupported]
	);

	const watchPosition = React.useCallback(
		(options?: PositionOptions): number | null => {
			if (!isSupported) return null;
			return navigator.geolocation.watchPosition(
				pos => {
					setPosition(pos);
					setError(null);
				},
				err => {
					setError(err);
				},
				options
			);
		},
		[isSupported]
	);

	const clearWatch = React.useCallback(
		(watcherId: number): void => {
			if (!isSupported) return;
			navigator.geolocation.clearWatch(watcherId);
		},
		[isSupported]
	);

	return {
		isSupported,
		permissionState,
		position,
		error,
		getCurrentPosition,
		watchPosition,
		clearWatch,
	};
}
