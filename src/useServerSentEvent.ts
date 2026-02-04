import * as React from 'react';

export interface UseServerSentEventOptions {
	/**
	 * Whether the connection should be established.
	 * Usefull to lazily connect.
	 */
	enabled?: boolean;

	/**
	 * Called when an error occurs.
	 */
	onError?: (event: Event) => void;

	/**
	 * Called on every incoming message event.
	 */
	onMessage?: (event: MessageEvent<string>) => void;

	/**
	 * Called then the connection is opened.
	 */
	onOpen?: (event: Event) => void;

	/**
	 * Whether credentials (cookies) should be sent.
	 */
	withCredentials?: boolean;
}

export interface UseServerSentEventReturn {
	/**
	 * Manually closes the connection.
	 */
	close: () => void;

	/**
	 * Current connection state.
	 */
	readyState: SSEReadyState | null;
}

export type SSEReadyState = 0 | 1 | 2;
/**
 * 0 = CONNECTING
 * 1 = OPEN
 * 2 = CLOSED
 */

/**
 * `useServerSideEvent` provides unopinionated access to Server-Sent Event (SSE) via the EventSource Web API.
 * It manages the EventSource lifecycle but delegates data handling to consumer callbacks.
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
): UseServerSentEventReturn {
	const {
		enabled = true,
		onError,
		onMessage,
		onOpen,
		withCredentials = false,
	} = options;

	const sourceRef = React.useRef<EventSource | null>(null);
	const [readyState, setReadyState] = React.useState<SSEReadyState | null>(
		null
	);

	const onMessageRef = React.useRef(onMessage);
	const onOpenRef = React.useRef(onOpen);
	const onErrorRef = React.useRef(onError);

	const isSupported =
		typeof window !== 'undefined' && typeof EventSource !== 'undefined';

	const close = React.useCallback(() => {
		sourceRef.current?.close();
		sourceRef.current = null;
		setReadyState(null);
	}, []);

	React.useEffect(() => {
		onMessageRef.current = onMessage;
		onOpenRef.current = onOpen;
		onErrorRef.current = onError;
	}, [onMessageRef, onOpenRef, onErrorRef]);

	React.useEffect(() => {
		if (!isSupported || !enabled) return;
		const source = new EventSource(url, { withCredentials });
		sourceRef.current = source;

		source.onopen = event => {
			setReadyState(source.readyState as SSEReadyState);
			onOpenRef.current?.(event);
		};

		source.onmessage = event => {
			setReadyState(source.readyState as SSEReadyState);
			onMessageRef.current?.(event);
		};

		source.onerror = event => {
			setReadyState(source.readyState as SSEReadyState);
			onErrorRef.current?.(event);
		};

		return () => {
			source.close();
			sourceRef.current = null;
		};
	}, [url, enabled, withCredentials, isSupported]);

	return {
		close,
		readyState,
	};
}
