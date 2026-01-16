import * as React from 'react';

export interface UsePopoverResult {
	/**
	 * Whether the popover is open.
	 */
	isOpen: boolean;

	/**
	 * Opens the popover.
	 */
	open: () => void;

	/**
	 * Closes the popover.
	 */
	close: () => void;

	/**
	 * Toggles the popover.
	 */
	toggle: () => void;

	/**
	 * Ref for the anchor (trigger) element.
	 */
	anchorRef: React.RefObject<HTMLElement | null>;

	/**
	 * Ref for the popover element.
	 */
	popoverRef: React.RefObject<HTMLElement | null>;
}

/**
 * `usePopover` is React hook that manages the open/close state and lifecycle of a popover anchored to a trigger element.
 *
 * @returns Popover state and helpers.
 *
 * @example
 * ```tsx
 *  const popover = usePopover();
 *
 * return (
 *   <>
 *     <button ref={popover.anchorRef} onClick={popover.toggle}>
 *       Open
 *     </button>
 *
 *     {popover.isOpen && (
 *       <div ref={popover.popoverRef}>
 *         Content
 *       </div>
 *     )}
 *   </>
 * );
 * ```
 *
 * @author Sebastian Marat Urdanegui Bisalaya <https://sebastianurdanegui.com>
 *
 * @since 0.0.1
 * @version 0.0.1
 *
 */
export function usePopover(): UsePopoverResult {
	const [isOpen, setIsOpen] = React.useState<boolean>(false);

	const anchorRef = React.useRef<HTMLElement>(null);
	const popoverRef = React.useRef<HTMLElement>(null);

	const open = React.useCallback(() => {
		setIsOpen(true);
	}, []);

	const close = React.useCallback(() => {
		setIsOpen(false);
	}, []);

	const toggle = React.useCallback(() => {
		setIsOpen(isOpen => !isOpen);
	}, []);

	React.useEffect(() => {
		if (!isOpen) return;
		const onClickOutside = (event: MouseEvent) => {
			const target = event.target as Node;
			if (
				popoverRef.current?.contains(target) ||
				anchorRef.current?.contains(target)
			) {
				return;
			}
			close();
		};
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				close();
			}
		};
		document.addEventListener('mousedown', onClickOutside);
		document.addEventListener('keydown', onKeyDown);
		return () => {
			document.removeEventListener('mousedown', onClickOutside);
			document.removeEventListener('keydown', onKeyDown);
		};
	}, [isOpen, close]);

	return {
		isOpen,
		open,
		close,
		toggle,
		anchorRef,
		popoverRef,
	};
}
