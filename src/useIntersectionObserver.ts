import * as React from 'react';

export type IntersectionObserverOptions = IntersectionObserverInit & {
    once?: boolean;
    onChange?: (entry: IntersectionObserverEntry) => void;
};

export type IntersectionObserver = {
    ref: React.RefObject<HTMLElement>;
    options?: IntersectionObserverOptions;
}

export function useIntersectionObserver({ ref, options }: IntersectionObserver) {
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
        entry,
        isVisible,
    }
}