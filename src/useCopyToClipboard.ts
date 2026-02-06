import * as React from 'react';

export interface CopyToClipboardReturn {
	copyToClipboard: (text: string) => Promise<void>;
	textCopied: string | null;
}

/**
 * `useCopyToClipboard` provides a safe way to copy text to the clipboard
 * using the Clipboard API.
 *
 * @example
 * ```tsx
 * const { textCopied, copyToClipboard } = useCopyToClipboard();
 *
 * <button onClick={() => copyToClipboard('Hello!')}>
 *  Copy
 * </button>
 * ```
 *
 * @author Sebastian Marat Urdanegui Bisalaya <https://sebastianurdanegui.com>
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API
 * @version 0.0.1
 *
 */
export function useCopyToClipboard(): CopyToClipboardReturn {
	const [textCopied, setTextCopied] = React.useState<string | null>(null);

	const copyToClipboard = React.useCallback(async (text: string) => {
		if (!navigator?.clipboard?.writeText) {
			throw new Error('Clipboard API not available.');
		}
		await navigator.clipboard.writeText(text);
		setTextCopied(text);
	}, []);

	return {
		copyToClipboard,
		textCopied,
	};
}
