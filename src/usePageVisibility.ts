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

const listeners = new Set<Listener>();

function emit() {
    listeners.forEach(listener => listener());
}

const pageVisibilityStore = {
    suscribe(listener: Listener) {
        listeners.add(listener);

        if (typeof document !== 'undefined') {
            document.addEventListener('visibilitychange', emit);
            return () => {
                listeners.delete(listener);
                document.removeEventListener('visibilitychange', emit);
            }
        }

        return () => listeners.delete(listener);
    },
    getSnapshot(): DocumentVisibilityState {
        if (typeof document === 'undefined') return 'visible';
        return document.visibilityState;
    },
    getServerSnapshot(): DocumentVisibilityState {
        return 'visible';
    }
};

/**
 * `usePageVisibility` is a React hook that exposes the current visibility
 * state of the document using the Page Visibility API.
 *
 * Characteristics:
 * - SSR-safe
 * - Uses `useSyncExternalStore`
 * - Unopinionated (no side effects)
 * - Suitable for pausing/resuming logic externally
 *
 * @returns {PageVisibilityReturn}
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
 *
 * @author Sebastian Marat Urdanegui Bisalaya <sebastianurdanegui.com>
 *
 * @since 0.0.1
 * @version 0.0.1
 *
 */
export function usePageVisibility(): PageVisibilityReturn {
    const visibilityState = React.useSyncExternalStore(
        pageVisibilityStore.suscribe,
        pageVisibilityStore.getSnapshot,
        pageVisibilityStore.getServerSnapshot
    );
    return {
        isVisible: visibilityState === 'visible',
        visibilityState
    }
}
