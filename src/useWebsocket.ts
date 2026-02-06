import * as React from 'react';

export interface UseWebsocketOptions<TMessage = unknown> {
	/**
	 * Should the socket auto-connect inmediately (default: true)
	 */
	autoConnect?: boolean;

	/**
	 * Max number of reconnection attempts (default: Infinity)
	 */
	maxRetries?: number;

	/**
	 * Called when the socket closes unexpectedly
	 */
	onClose?: (event: CloseEvent) => void;

	/**
	 * Called when an error occurs
	 */
	onError?: (event: Event) => void;

	/**
	 * Called when a message is received
	 */
	onMessage?: (message: TMessage) => void;

	/**
	 * Reconnection interval in milliseconds (default: 3000)
	 */
	reconnectionInterval?: number;

	/**
	 * Websocket url
	 */
	url: string;
}

export interface UseWebsocketReturn<TMessage = unknown> {
	/**
	 * Manually reconnect the Websocket
	 */
	connect: () => void;

	/**
	 * Manually disconnect the Websocket
	 */
	disconnect: () => void;

	/**
	 * Show any errors
	 */
	error: Error | null;

	/**
	 * Connection status
	 */
	isConnected: boolean;

	/**
	 * Latest received message
	 */
	message: TMessage | null;

	/**
	 * Messages
	 */
	messages: TMessage[];

	/**
	 * Send a message via Websocket
	 */
	send: (data: string | ArrayBuffer | Blob | ArrayBufferView) => void;
}

/**
 * `useWebsocket` is a React hook to manage Websocket connections with auto-reconnect, error handling, and SSR safety.
 *
 * @example
 * ```tsx
 * const { socket, message, isConnected, send } = useWebsocket<{ text: string }>({
 *   url: 'wss://example.com/socket',
 *   onMessage: (msg) => console.log(msg),
 * });
 *
 * React.useEffect(() => {
 *   if (isConnected) send(JSON.stringify({ hello: 'world' }));
 * }, [isConnected]);
 * ```
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API
 */
export function useWebsocket<TMessage = unknown>(
	options: UseWebsocketOptions<TMessage>
): UseWebsocketReturn<TMessage> {
	const {
		autoConnect = true,
		maxRetries = Infinity,
		onClose,
		onError,
		onMessage,
		reconnectionInterval = 3000,
		url,
	} = options;

	const [message, setMessage] = React.useState<TMessage | null>(null);
	const [messages, setMessages] = React.useState<TMessage[]>([]);
	const [isConnected, setIsConnected] = React.useState<boolean>(false);
	const [error, setError] = React.useState<Error | null>(null);

	const socketRef = React.useRef<WebSocket | null>(null);
	const retriesRef = React.useRef<number>(0);
	const reconnectTimeoutRef = React.useRef<ReturnType<
		typeof setTimeout
	> | null>(null);
	const manualCloseRef = React.useRef<boolean>(false);
	const hasOpenedRef = React.useRef<boolean>(false);

	const onMessageRef = React.useRef(onMessage);
	const onCloseRef = React.useRef(onClose);
	const onErrorRef = React.useRef(onError);

	React.useEffect(() => {
		onMessageRef.current = onMessage;
		onCloseRef.current = onClose;
		onErrorRef.current = onError;
	}, [onMessage, onClose, onError]);

	const connect = React.useCallback(() => {
		if (typeof window === 'undefined') return;
		manualCloseRef.current = false;
		hasOpenedRef.current = false;

		const ws = new WebSocket(url);
		socketRef.current = ws;

		ws.onopen = () => {
			hasOpenedRef.current = true;
			setIsConnected(true);
			setError(null);
			retriesRef.current = 0;
		};

		ws.onmessage = event => {
			let data: TMessage;
			try {
				data = JSON.parse(event.data);
			} catch {
				data = event.data as TMessage;
			}
			setMessage(data);
			setMessages(prev => [...prev, data]);
			onMessageRef.current?.(data);
		};

		ws.onclose = event => {
			setIsConnected(false);
			onCloseRef.current?.(event);
			if (
				hasOpenedRef.current &&
				!manualCloseRef.current &&
				retriesRef.current < maxRetries
			) {
				retriesRef.current += 1;
				reconnectTimeoutRef.current = setTimeout(connect, reconnectionInterval);
			}
		};

		ws.onerror = event => {
			setError(prev => prev ?? new Error('WebSocket error'));
			onErrorRef.current?.(event);
		};
	}, [url, reconnectionInterval, maxRetries]);

	const disconnect = React.useCallback(() => {
		manualCloseRef.current = true;
		if (socketRef.current) {
			socketRef.current.close();
			socketRef.current = null;
		}
		if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
	}, []);

	const reconnect = React.useCallback(() => {
		disconnect();
		connect();
	}, [disconnect, connect]);

	React.useEffect(() => {
		if (!autoConnect) return;
		connect();
		return () => {
			disconnect();
		};
	}, [autoConnect, connect, disconnect]);

	const send = React.useCallback(
		(data: string | ArrayBuffer | Blob | ArrayBufferView) => {
			const socket = socketRef.current;
			if (!socket || socket.readyState !== WebSocket.OPEN) {
				setError(new Error('WebSocket is not connected. Message not sent.'));
				return;
			}
			socket.send(data);
		},
		[]
	);

	return {
		connect: reconnect,
		disconnect,
		error,
		isConnected,
		message,
		messages,
		send,
	};
}
