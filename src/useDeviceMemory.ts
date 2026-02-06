import * as React from 'react';

export interface UseDeviceMemoryReturn {
	/**
	 * Approximate amount of device memory in gigabytes.
	 *
	 * According to the Device Memory API specification, the values is rounded and typically one of: 0.25, 0.5, 1, 2, 4, 8.
	 * `undefined` when executed during SSR or the browser does not support the Device Memory API.
	 */
	deviceMemory?: number | undefined;

	/**
	 * Indicates whether the Device Memory API is supported in the current execution environment.
	 */
	isSupported: boolean;
}

/**
 * `useDeviceMemory` is a react hook to safely access the Device Memory API in an unopinionated and SSR-sage way
 *
 * @example
 * ```tsx
 * function Example() {
 *   const { deviceMemory, isSupported } = useDeviceMemory();
 *
 *   if (!isSupported) {
 *     return <span>Device Memory API not supported</span>;
 *   }
 *
 *   return (
 *     <span>
 *       Device memory: {deviceMemory ?? 'unknown'} GB
 *     </span>
 *   );
 * }
 * ```
 *
 * @author Sebastian Marat Urdanegui Bisalaya <https://sebastianurdanegui.com>
 *
 * @version 0.0.1
 *
 */
export function useDeviceMemory(): UseDeviceMemoryReturn {
	const isClient =
		typeof window !== 'undefined' && typeof navigator !== 'undefined';
	const isSupported = isClient && 'deviceMemory' in navigator;

	const deviceMemory = React.useMemo<number | undefined>(() => {
		if (!isSupported) return undefined;
		return (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
	}, [isSupported]);

	return {
		deviceMemory,
		isSupported,
	};
}
