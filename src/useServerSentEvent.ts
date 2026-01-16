import * as React from 'react';

export interface UseServerSentEventOptions {
	/**
	 * Whether the connection should be established.
	 * Usefull to lazily connect.
	 */
	enabled?: boolean;

	/**
	 * Whether credentials (cookies) should be sent.
	 */
	withCredentials?: boolean;

	/**
	 * Called then the connection is opened.
	 */
	onOpen?: (event: Event) => void;

	/**
	 * Called on every incoming message event.
	 */
	onMessage?: (event: MessageEvent<string>) => void;

	/**
	 * Called when an error occurs.
	 */
	onError?: (event: Event) => void;
}

export interface UseServerSentEventResult {
	/**
	 * Current connection state.
	 */
	readyState: number | null;

	/**
	 * Manually closes the connection.
	 */
	close: () => void;
}

/**
 * `useServerSideEvent` provides unopinionated access to Server-Sent Event (SSE) via the EventSource Web API.
 * It manages the EventSource lifecycle but delegates data handling to consumer callbacks.
 *
 * @param url SSE endpoint URL.
 * @param options Connection and lifecycle options.
 *
 * @returns SSE connection helpers and state.
 *
 * @example
 * ```tsx
 * useServerSideEvent('/api/events', {
 *   onMessage: (e) => {
 *     const data = JSON.parse(e.data);
 *     console.log(data);
 *   }
 * });
 * ```
 *
 * @author Sebastian Marat Urdanegui Bisalaya <https://sebastianurdanegui.com>
 *
 * @since 0.0.1
 * @version 0.0.1
 *
 */
export function useServerSentEvent(
	url: string,
	options: UseServerSentEventOptions = {}
): UseServerSentEventResult {
	const {
		enabled = true,
		withCredentials = false,
		onOpen,
		onMessage,
		onError,
	} = options;

	const sourceRef = React.useRef<EventSource | null>(null);
	const [readyState, setReadyState] = React.useState<number | null>(null);

	const isSupported =
		typeof window !== 'undefined' && typeof EventSource !== 'undefined';

	const close = React.useCallback(() => {
		sourceRef.current?.close();
		sourceRef.current = null;
		setReadyState(null);
	}, []);

	React.useEffect(() => {
		if (!isSupported || !enabled) return;
		const source = new EventSource(url, { withCredentials });
		sourceRef.current = source;

		source.onopen = event => {
			setReadyState(source.readyState);
			onOpen?.(event);
		};

		source.onmessage = event => {
			setReadyState(source.readyState);
			onMessage?.(event);
		};

		source.onerror = event => {
			setReadyState(source.readyState);
			onError?.(event);
		};

		return () => {
			source.close();
			sourceRef.current = null;
		};
	}, [url, enabled, withCredentials, onOpen, onMessage, onError, isSupported]);

	return {
		readyState,
		close,
	};
}
