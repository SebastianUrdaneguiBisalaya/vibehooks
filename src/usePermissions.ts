import * as React from 'react';

export type PermissionState = 'granted' | 'denied' | 'prompt';

export type PermissionsSnapshot = Partial<
	Record<PermissionName, PermissionState>
>;

export interface UsePermissionReturn {
	isSupported: boolean;
	permissions: PermissionsSnapshot;
}

/**
 * `usePermissions` is a React hook unopinionated to observe in real-time the permission status of browser using the Permissions API.
 * This hook does not manage permissions, it only observes them.
 *
 * @example
 * ```tsx
 * const { permissions, isSupported } = usePermissions([
 *   'camera',
 *   'microphone',
 *   'geolocation'
 * ]);
 *
 * if (permissions.camera === 'denied') {
 *   // Show a message to the user
 * }
 * ```
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API
 */
export function usePermissions<T extends readonly PermissionName[]>(
	permissionNames: T
): UsePermissionReturn {
	const isBrowser =
		typeof window !== 'undefined' && typeof navigator !== 'undefined';
	const isSupported = isBrowser && 'permissions' in navigator;

	const [permissions, setPermissions] = React.useState<PermissionsSnapshot>({});

	const statusRef = React.useRef<
		Partial<Record<PermissionName, PermissionStatus>>
	>({});

	React.useEffect(() => {
		if (!isSupported) return;
		let cancelled = false;
		const cleanups: Array<() => void> = [];

		const setupPermission = async (name: PermissionName) => {
			try {
				const status = await navigator.permissions.query({
					name: name as PermissionName,
				});
				if (cancelled) return;

				statusRef.current[name] = status;
				setPermissions(prev => {
					if (prev[name] === status.state) return prev;
					return { ...prev, [name]: status.state };
				});

				const handleChange = () => {
					setPermissions(prev => {
						if (prev[name] === status.state) return prev;
						return { ...prev, [name]: status.state };
					});
				};

				status.addEventListener('change', handleChange);

				cleanups.push(() => {
					status.removeEventListener('change', handleChange);
				});
			} catch {
				// TODO: handle error
			}
		};

		for (const name of permissionNames) {
			void setupPermission(name);
		}

		return () => {
			cancelled = true;
			cleanups.forEach(fn => fn());
		};
	}, [isSupported, permissionNames]);

	return {
		isSupported,
		permissions,
	};
}
