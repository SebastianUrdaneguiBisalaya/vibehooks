import * as React from 'react';

export interface UseOnlineReturn {
	/**
	 * Whether the browser is considered online.
	 * Note: `true` does not guarantee internet access.
	 */
	online: boolean;
}

function suscribe(callback: () => void) {
	window.addEventListener('online', callback);
	window.addEventListener('offline', callback);
	return () => {
		window.removeEventListener('online', callback);
		window.removeEventListener('offline', callback);
	};
}

function getSnapshot(): boolean {
	return navigator.onLine;
}

function getServerSnapshot(): boolean {
	return true;
}

/**
 * `useOnline` is an unopinionated hook that exposes the browser's online status based on the Navigator.onLine API.
 * It automatically stays in sync with `online` and `offline` events.
 *
 * @author Sebastian Marat Urdanegui Bisalaya <https://sebastianurdanegui.com>
 *
 * @see https://developer.mozilla.org/es/docs/Web/API/Navigator/onLine
 * @since 0.0.1
 * @version 0.0.1
 */
export function useOnline(): UseOnlineReturn {
	const online = React.useSyncExternalStore(
		suscribe,
		getSnapshot,
		getServerSnapshot
	);
	return {
		online,
	};
}
