import * as React from 'react';

export interface FullScreen {
    isFullscreen: boolean;
    enter: () => Promise<void>;
    exit: () => Promise<void>;
    toggle: () => Promise<void>;
}

/**
 * `useFullScreen` controls the browser Fullscreen API.
 * 
 * @param `ref` Ref to the element to be fullscreened.
 * 
 * @returns An object with the current fullscreen status, enter, exit, and toggle functions.
 * 
 * @example
 * ```tsx
 * const { isFullscreen, enter, exit, toggle } = useFullscreen<HTMLDivElement>(ref);
 * ```
 * 
 * @author Sebastian Marat Urdanegui Bisalaya <sebastianurdanegui.com>
 * 
 * @since 0.0.1
 * @version 0.0.1
 * 
 */
export function useFullscreen<T extends HTMLElement>(ref: React.RefObject<T>): FullScreen {
    const [isFullscreen, setIsFullscreen] = React.useState<boolean>(false);

    const enter = React.useCallback(async () => {
        if (!ref.current) return;
        if (document.fullscreenElement) return;
        await ref.current.requestFullscreen();
    }, []);

    const exit = React.useCallback(async () => {
        if (!document.fullscreenElement) return;
        await document.exitFullscreen();
    }, []);

    const toggle = React.useCallback(async () => {
        if (document.fullscreenElement) {
            await exit();
        } else {
            await enter();
        }
    }, [enter, exit]);

    React.useEffect(() => {
        const handleChange = () => {
            setIsFullscreen(Boolean(document.fullscreenElement));
        }

        document.addEventListener('fullscreenchange', handleChange);
        return () => document.removeEventListener('fullscreenchange', handleChange);
    }, []);

    return {
        isFullscreen,
        enter,
        exit,
        toggle
    }
}