import * as React from 'react';

export interface UseAutoScrollOptions {
	behavior?: 'auto' | 'smooth';
	enabled?: boolean;
	threshold?: number;
}

/**
 * `useAutoScroll` is a custom hook for automatically scrolling to the bottom of a container element.
 * It keeps the scroll at the bottom of the container while new content is generated, but only if the user is near the bottom. If the user scrolls up to read previous content, auto-scrolling is automatically disabled so as not to interrupt their reading.
 *
 * @example
 * ```tsx
 * function ChatInterface() {
 *   const { ref, isAtBottom, scrollToBottom } = useAutoScroll({
 *     threshold: 50,
 *     behavior: 'smooth'
 *   });
 *
 *   return (
 *     <div>
 *       <div ref={ref} className="chat-container">
 *         {messages.map(msg => (
 *           <Message key={msg.id} content={msg.content} />
 *         ))}
 *       </div>
 *       {!isAtBottom && (
 *         <button onClick={scrollToBottom}>
 *           Ir al final ↓
 *         </button>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 * @author Sebastian Marat Urdanegui Bisalaya <https://sebastianurdanegui.com>
 *
 * @version 0.0.1
 *
 */
export function useAutoScroll(options?: UseAutoScrollOptions) {
	const {
		behavior = 'auto',
		enabled: initialEnabled = true,
		threshold = 100,
	} = options || {};

	const containerRef = React.useRef<HTMLDivElement>(null);
	const [isAtBottom, setIsAtBottom] = React.useState<boolean>(true);
	const [autoScrollEnabled, setAutoScrollEnabled] =
		React.useState<boolean>(initialEnabled);
	const isScrollingProgrammatically = React.useRef<boolean>(false);

	const checkIfABottom = React.useCallback(() => {
		const container = containerRef.current;
		if (!container) return false;
		const { clientHeight, scrollHeight, scrollTop } = container;
		const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
		return distanceFromBottom <= threshold;
	}, [threshold]);

	const scrollToBottom = React.useCallback(
		(forceSmooth?: boolean) => {
			const container = containerRef.current;
			if (!container) return;
			isScrollingProgrammatically.current = true;
			container.scrollTo({
				behavior:
					forceSmooth !== undefined
						? forceSmooth
							? 'smooth'
							: 'auto'
						: behavior,
				top: container.scrollHeight,
			});
			setTimeout(() => {
				isScrollingProgrammatically.current = false;
			}, 100);
		},
		[behavior]
	);

	const enableAutoScroll = React.useCallback(() => {
		setAutoScrollEnabled(true);
		scrollToBottom();
	}, [scrollToBottom]);

	const disableAutoScroll = React.useCallback(() => {
		setAutoScrollEnabled(false);
	}, []);

	const handleScroll = React.useCallback(() => {
		if (isScrollingProgrammatically.current) return;
		const atBottom = checkIfABottom();
		setIsAtBottom(atBottom);
		if (!atBottom && autoScrollEnabled) {
			setAutoScrollEnabled(false);
		} else if (atBottom && !autoScrollEnabled) {
			setAutoScrollEnabled(true);
		}
	}, [checkIfABottom, autoScrollEnabled]);

	React.useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const observer = new MutationObserver(() => {
			if (autoScrollEnabled && isAtBottom) {
				scrollToBottom(false);
			}
		});
		observer.observe(container, {
			characterData: true,
			childList: true,
			subtree: true,
		});
		return () => observer.disconnect();
	}, [autoScrollEnabled, isAtBottom, scrollToBottom]);

	React.useEffect(() => {
		const container = containerRef.current;
		if (!container) return;
		container.addEventListener('scroll', handleScroll, { passive: true });
		return () => container.removeEventListener('scroll', handleScroll);
	}, []);

	React.useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const initialCheck = () => {
			const atBottom = checkIfABottom();
			setIsAtBottom(atBottom);
		};

		initialCheck();

		const images = container.querySelectorAll('img');
		images.forEach(img => {
			img.addEventListener('load', initialCheck);
		});

		return () => {
			images.forEach(img => {
				img.removeEventListener('load', initialCheck);
			});
		};
	}, [checkIfABottom]);

	return {
		autoScrollEnabled,
		disableAutoScroll,
		enableAutoScroll,
		isAtBottom,
		ref: containerRef,
		scrollToBottom,
	};
}
