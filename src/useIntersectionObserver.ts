import * as React from 'react';

export type IntersectionObserverOptions = IntersectionObserverInit & {
    /**
     * If true, the observer disconnects after the first intersection.
     */
    once?: boolean;

    /**
     * Callback that executes every time the IntersectionObserverEntry changes.
     */
    onChange?: (entry: IntersectionObserverEntry) => void;
};

export interface IntersectionObserverReturn<T extends Element> {
    /**
     * Ref will be assigned to the element that is being observed.
     */
    ref: React.RefObject<T | null>;

    /**
     * Last IntersectionObserverEntry.
     */
    entry: IntersectionObserverEntry | null;

    /**
     * Indicates if the element is visible in the viewport.
     */
    isVisible: boolean;
}

/**
 * `useIntersectionObserver` observers the visibility of an element using the native IntersectionObserver API.
 * Returns a typed `ref` that must be assigned to the element you want to observe.
 * 
 * @typeParm T DOM element type. (e.g. HTMLDivElement).
 * 
 * @param options IntersectionObserverOptions Configurations.
 
* @returns An object with the reference, visibility state, and last entry.
 * 
 * @example
 * ```tsx
 * const { ref, isVisible } = useIntersectionObserver<HTMLDivElement>({
 *  threshold: 0.5,
 *  once: true,
 * });
 * 
 * return <div ref={ref}>{isVisible}</div>;
 * ```
 * 
 * @author Sebastian Marat Urdanegui Bisalaya <sebastianurdanegui.com>
 * 
 * @since 0.0.1
 * @version 0.0.1
 * 
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
 */
export function useIntersectionObserver<T extends Element = HTMLElement>(options?: IntersectionObserverOptions): IntersectionObserverReturn<T> {
    const ref = React.useRef<T | null>(null);

    const [entry, setEntry] = React.useState<IntersectionObserverEntry | null>(null);
    const [isVisible, setIsVisible] = React.useState<boolean>(false);

    const callbackRef = React.useRef(options?.onChange);
    callbackRef.current = options?.onChange;

    const onceRef = React.useRef(false);

    React.useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver((entries, observer) => {
            const firstEntry = entries[0];
            if (!firstEntry) return;
            setEntry(firstEntry);
            setIsVisible(firstEntry.isIntersecting);
            callbackRef.current?.(firstEntry);
            if (options?.once && firstEntry.isIntersecting && !onceRef.current) {
                onceRef.current = true;
                observer.unobserve(element);
                observer.disconnect();
            }
        }, options);
        observer.observe(element);
        return () => observer.disconnect();
    }, [options?.root, options?.rootMargin, options?.threshold, options?.once, ref]);
    return {
        ref,
        entry,
        isVisible
    }
}