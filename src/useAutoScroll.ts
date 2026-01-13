import * as React from 'react';

export interface UseAutoScrollOptions {
	threshold?: number;
	behavior?: 'auto' | 'smooth';
	enabled?: boolean;
}

/**
 * `useAutoScroll` is a custom hook for automatically scrolling to the bottom of a container element.
 * It keeps the scroll at the bottom of the container while new content is generated, but only if the user is near the bottom. If the user scrolls up to read previous content, auto-scrolling is automatically disabled so as not to interrupt their reading.
 * @params options - Configuration object for the hook.
 * @returns An API for controlling the auto-scroll behavior:
 * - `ref`: A ref to the container element.
 * - `isAtBottom`: Whether the user is near the bottom of the container.
 * - `scrollToBottom`: A function to scroll the container to the bottom.
 * - `enableAutoScroll`: Enable auto-scrolling.
 * - `disableAutoScroll`: Disable auto-scrolling.
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
 * @example
 * ```tsx
 * // Con control manual del auto-scroll
 * function AdvancedChat() {
 *   const {
 *     ref,
 *     isAtBottom,
 *     enableAutoScroll,
 *     disableAutoScroll
 *   } = useAutoScroll();
 *
 *   const handleUserScroll = () => {
 *     // Desactivar auto-scroll cuando el usuario scrollea manualmente
 *     if (!isAtBottom) {
 *       disableAutoScroll();
 *     }
 *   };
 *
 *   return (
 *     <div
 *       ref={ref}
 *       onWheel={handleUserScroll}
 *       className="chat-container"
 *     >
 *       {messages.map(msg => <Message key={msg.id} {...msg} />)}
 *     </div>
 *   );
 * }
 * ```
 * @author Sebastian Marat Urdanegui Bisalaya <https://sebastianurdanegui.com>
 *
 * @since 0.0.1
 * @version 0.0.1
 *
 */
export function useAutoScroll(options?: UseAutoScrollOptions) {
	const {
		threshold = 100,
		behavior = 'auto',
		enabled: initialEnabled = true,
	} = options || {};

	const containerRef = React.useRef<HTMLDivElement>(null);
	const [isAtBottom, setIsAtBottom] = React.useState<boolean>(true);
	const [autoScrollEnabled, setAutoScrollEnabled] =
		React.useState<boolean>(initialEnabled);
	const isScrollingProgrammatically = React.useRef<boolean>(false);

	const checkIfABottom = React.useCallback(() => {
		const container = containerRef.current;
		if (!container) return false;
		const { scrollTop, scrollHeight, clientHeight } = container;
		const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
		return distanceFromBottom <= threshold;
	}, [threshold]);

	const scrollToBottom = React.useCallback(
		(forceSmooth?: boolean) => {
			const container = containerRef.current;
			if (!container) return;
			isScrollingProgrammatically.current = true;
			container.scrollTo({
				top: container.scrollHeight,
				behavior:
					forceSmooth !== undefined
						? forceSmooth
							? 'smooth'
							: 'auto'
						: behavior,
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
			childList: true,
			subtree: true,
			characterData: true,
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
		ref: containerRef,
		isAtBottom,
		scrollToBottom,
		enableAutoScroll,
		disableAutoScroll,
		autoScrollEnabled,
	};
}
