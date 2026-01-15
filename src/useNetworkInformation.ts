import * as React from 'react';

export interface NetworkInformation {
	readonly type?:
		| 'bluetooth'
		| 'cellular'
		| 'ethernet'
		| 'node'
		| 'wifi'
		| 'wimax'
		| 'other'
		| 'unknown';
	readonly effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
	/**
	 * Estimated effective bandwidth of the user's connection, in megabits per second (Mb/s).
	 *
	 * This value is a browser-provided heuristic based on recently observed network performance.
	 * It does NOT represent the user's contracted bandwidth nor a speed-test result.
	 *
	 * ### Practical interpretation (approximate)
	 * - < 1 Mb/s   → very slow connection (avoid heavy assets)
	 * - 1 – 3 Mb/s → slow connection
	 * - 3 – 10 Mb/s → moderate connection
	 * - > 10 Mb/s  → fast connection
	 *
	 * ### Recommended usage
	 * - Adapt image quality and media bitrates.
	 * - Reduce prefetching and background requests on low values.
	 *
	 * ### Notes
	 * - The value may fluctuate over time.
	 * - Not available in all browsers.
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation/downlink
	 */
	readonly downlink?: number;
	/**
	 * Maximum theoretical bandwidth of the underlying network link, in megabits per second (Mb/s).
	 *
	 * This represents the estimated capacity of the physical or logical connection
	 * (e.g., Wi-Fi, Ethernet), not the observed throughput.
	 *
	 * ### Typical values
	 * - Cellular networks → low to moderate
	 * - Wi-Fi / Ethernet → high or Infinity
	 *
	 * ### Recommended usage
	 * - Decide whether large downloads are feasible.
	 * - Compare against `downlink` to detect congestion.
	 *
	 * ### Notes
	 * - Often undefined or `Infinity`.
	 * - Not consistently implemented across browsers.
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation/downlinkMax
	 */
	readonly downlinkMax?: number;
	/**
	 * Estimated round-trip time (RTT), in milliseconds (ms).
	 *
	 * RTT measures the time it takes for a network request to travel from the client
	 * to the server and back.
	 *
	 * ### Practical interpretation (approximate)
	 * - < 50 ms   → excellent latency
	 * - 50 – 150 ms → acceptable
	 * - 150 – 300 ms → noticeable latency
	 * - > 300 ms → high latency (degraded real-time UX)
	 *
	 * ### Recommended usage
	 * - Tune request timeouts.
	 * - Decide between polling vs real-time transports.
	 * - Disable latency-sensitive features on high RTT.
	 *
	 * ### Notes
	 * - Values are estimates, not precise measurements.
	 * - RTT may vary significantly on mobile networks.
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation/rtt
	 */
	readonly rtt?: number;
	/**
	 * Indicates whether the user has enabled a reduced data usage mode (Data Saver).
	 *
	 * This is an explicit user preference, not a performance metric.
	 * When `true`, the user is signaling intent to minimize network usage.
	 *
	 * ### Recommended behavior when enabled
	 * - Serve lower-resolution images.
	 * - Disable autoplay media.
	 * - Avoid aggressive prefetching.
	 * - Reduce background network activity.
	 *
	 * ### Priority rule
	 * `saveData === true` SHOULD override optimistic decisions based on
	 * `downlink` or `downlinkMax`.
	 *
	 * ### Notes
	 * - Availability depends on browser and OS.
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation/saveData
	 */
	readonly saveData?: boolean;

	addEventListener(type: 'change', listener: () => void): void;
	removeEventListener(type: 'change', listener: () => void): void;
}

declare global {
	interface Navigator {
		connection: NetworkInformation;
		mozConnection: NetworkInformation;
		webkitConnection: NetworkInformation;
	}
}

/**
 * `useNetworkInformation` returns live network information using the Network Information API.
 * The hook automatically updates when the underlying connection changes.
 *
 * @returns
 *
 * @example
 * ```tsx
 * const network = useNetworkInformation();
 *
 * if (!network.supported) {
 *   return <span>Network API not supported</span>;
 * }
 *
 * return (
 *   <div>
 *     <p>Type: {network.type}</p>
 *     <p>Effective type: {network.effectiveType}</p>
 *     <p>Downlink: {network.downlink} Mb/s</p>
 *   </div>
 * );
 * ```
 *
 * @author Sebastian Marat Urdanegui Bisalaya <https://sebastianurdanegui.com>
 *
 * @see https://developer.mozilla.org/es/docs/Web/API/Network_Information_API
 * @since 0.0.1
 * @version 0.0.1
 *
 */
export function useNetworkInformation() {
	const getConnection = React.useCallback((): NetworkInformation | null => {
		if (typeof navigator === 'undefined') return null;
		return (
			navigator.connection ??
			navigator.mozConnection ??
			navigator.webkitConnection ??
			null
		);
	}, []);

	const suscribe = React.useCallback(
		(onStoreChange: () => void) => {
			const connection = getConnection();
			if (!connection) return () => {};
			connection.addEventListener('change', onStoreChange);
			return () => {
				connection.removeEventListener('change', onStoreChange);
			};
		},
		[getConnection]
	);

	const getSnapshot = React.useCallback(() => getConnection(), [getConnection]);
	const getServerSnapshot = React.useCallback(() => null, []);

	const connection = React.useSyncExternalStore(
		suscribe,
		getSnapshot,
		getServerSnapshot
	);

	if (!connection) {
		return {
			supported: false,
			connection: null,
		};
	}

	return {
		supported: true,
		connection,
		type: connection.type,
		effectiveType: connection.effectiveType,
		downlink: connection.downlink,
		downlinkMax: connection.downlinkMax,
		rtt: connection.rtt,
		saveData: connection.saveData,
	};
}
