import * as React from 'react';

export interface PageVisibilityReturn {
	/**
	 * Whether the document is currently visible.
	 */
	isVisible: boolean;

	/**
	 * Current visibility state of the document.
	 */
	visibilityState: DocumentVisibilityState;
}

type Listener = () => void;

function visibilityStore() {
	const listeners = new Set<Listener>();
	let listening = false;

	function emit() {
		listeners.forEach(listener => listener());
	}

	function subscribe(listener: Listener) {
		listeners.add(listener);
		if (!listening && typeof document !== 'undefined') {
			document.addEventListener('visibilitychange', emit);
			listening = true;
		}
		return () => {
			listeners.delete(listener);
			if (
				listeners.size === 0 &&
				listening &&
				typeof document !== 'undefined'
			) {
				document.removeEventListener('visibilitychange', emit);
				listening = false;
			}
		};
	}

	function getSnapshot(): DocumentVisibilityState {
		if (typeof document === 'undefined') return 'visible';
		return document.visibilityState;
	}

	function getServerSnapshot(): DocumentVisibilityState {
		return 'visible';
	}

	return {
		getServerSnapshot,
		getSnapshot,
		subscribe,
	} as const;
}

export const pageVisibilityStore = visibilityStore();

/**
 * `usePageVisibility` is a React hook that exposes the current visibility
 * state of the document using the Page Visibility API.
 *
 * @example
 * ```tsx
 * function PollingController() {
 *   const { isVisible } = usePageVisibility();
 *
 *   React.useEffect(() => {
 *     if (!isVisible) pausePolling();
 *     else resumePolling();
 *   }, [isVisible]);
 *
 *   return null;s
 * }
 * ```
 */
export function usePageVisibility(): PageVisibilityReturn {
	const visibilityState = React.useSyncExternalStore(
		pageVisibilityStore.subscribe,
		pageVisibilityStore.getSnapshot,
		pageVisibilityStore.getServerSnapshot
	);
	return {
		isVisible: visibilityState === 'visible',
		visibilityState,
	};
}
