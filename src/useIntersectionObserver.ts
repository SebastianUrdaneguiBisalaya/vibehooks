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
 * @param externalRef Ref to the element to observe.
 *
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
 * @author Sebastian Marat Urdanegui Bisalaya <https://sebastianurdanegui.com>
 *
 * @since 0.0.1
 * @version 0.0.1
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
 */
export function useIntersectionObserver<T extends Element = HTMLElement>(
	options?: IntersectionObserverOptions,
	externalRef?: React.RefObject<T | null>
): IntersectionObserverReturn<T> {
	const internalRef = React.useRef<T | null>(null);
	const ref = externalRef ?? internalRef;

	const [entry, setEntry] = React.useState<IntersectionObserverEntry | null>(
		null
	);
	const [isVisible, setIsVisible] = React.useState<boolean>(false);

	const callbackRef = React.useRef(options?.onChange);
	callbackRef.current = options?.onChange;

	const observerOptions = React.useMemo(() => {
		return {
			root: options?.root,
			rootMargin: options?.rootMargin,
			threshold: options?.threshold,
		} as IntersectionObserverInit;
	}, [options?.root, options?.rootMargin, options?.threshold]);

	const once = options?.once;

	const onceRef = React.useRef(false);

	React.useEffect(() => {
		if (typeof window === 'undefined') return;
		const element = ref.current;
		if (!element) return;

		const observer = new IntersectionObserver((entries, observer) => {
			const firstEntry = entries[0];
			if (!firstEntry) return;
			setEntry(firstEntry);
			setIsVisible(firstEntry.isIntersecting);
			callbackRef.current?.(firstEntry);
			if (once && firstEntry.isIntersecting && !onceRef.current) {
				onceRef.current = true;
				observer.unobserve(element);
				observer.disconnect();
			}
		}, observerOptions);
		observer.observe(element);
		return () => observer.disconnect();
	}, [observerOptions, ref, once]);
	return {
		ref,
		entry,
		isVisible,
	};
}
