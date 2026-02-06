import * as React from 'react';

export type SummarizerAvailability =
	| 'available'
	| 'unavailable'
	| 'downloadable';

export type SummarizerType = 'tldr' | 'key-points' | 'headline' | 'paragraph';

export type SummarizerFormat = 'plain-text' | 'markdown';

export type SummarizerLength = 'short' | 'medium' | 'long';

export interface SummarizerCreateOptions {
	format?: SummarizerFormat;
	inputLanguage?: string;
	length?: SummarizerLength;
	outputLanguage?: string;
	signal?: AbortSignal;
	type?: SummarizerType;
}

export interface BrowserSummarizer {
	destroy(): void;
	summarize(text: string, options?: { signal?: AbortSignal }): Promise<string>;
}

export interface SummarizerStatic {
	availability(
		options?: SummarizerCreateOptions
	): Promise<SummarizerAvailability>;
	create(options?: SummarizerCreateOptions): Promise<BrowserSummarizer>;
}

declare global {
	interface Window {
		Summarizer: SummarizerStatic;
	}
}

export interface UseSummarizerReturn {
	/**
	 * Cancels any pending create or summarize operation.
	 */
	cancel(): void;

	/**
	 * Checks whether the browser AI model can satisfy the given options.
	 */
	checkAvailability(
		options?: SummarizerCreateOptions
	): Promise<SummarizerAvailability>;

	/**
	 * Creates a Summarizer instance with the given options.
	 * Requires recent user interaction to be triggered.
	 */
	create(options?: SummarizerCreateOptions): Promise<void>;

	/**
	 * Destroys the active Summarizer instance.
	 */
	destroy(): void;

	/**
	 * Checks if the provided error is an AbortError.
	 */
	isAbortError(error: unknown): boolean;

	/**
	 * Indicates whether the Summarizer API exists in the current environment.
	 */
	isSupported: boolean;

	/**
	 * Runs a sumamrization request using the active Summarizer instance.
	 */
	summarize(text: string): Promise<string>;
}

function isAbortError(error: unknown): boolean {
	return error instanceof DOMException && error.name === 'AbortError';
}

/**
 * `useSummarizer` is React hook that provides low-level access to the browser Summarizer API.
 *
 * @example
 * ```tsx
 * const {
 *   isSupported,
 *   checkAvailability,
 *   create,
 *   summarize,
 *   destroy,
 * } = useSummarizer();
 *
 * const run = async () => {
 *   const availability = await checkAvailability({
 *     type: 'tldr',
 *     format: 'markdown',
 *   });
 *
 *   if (availability !== 'available') return;
 *
 *   await create({ type: 'tldr' });
 *   const summary = await summarize(longText);
 *
 *   console.log(summary);
 *   destroy();
 * };
 * ```
 *
 * @author Sebastian Marat Urdanegui Bisalaya <https://sebastianurdanegui.com>
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Summarizer_API
 * @version 0.0.1
 *
 */
export function useSummarizer(): UseSummarizerReturn {
	const summarizerRef = React.useRef<BrowserSummarizer | null>(null);
	const abortRef = React.useRef<AbortController | null>(null);

	const isSupported =
		typeof window !== 'undefined' && typeof window.Summarizer !== 'undefined';
	const checkAvailability = React.useCallback(
		async (options?: SummarizerCreateOptions) => {
			if (!isSupported) return 'unavailable';
			return window.Summarizer.availability(options);
		},
		[isSupported]
	);

	const create = React.useCallback(
		async (options?: SummarizerCreateOptions) => {
			if (!isSupported) {
				throw new Error('Summarizer API not supported.');
			}
			abortRef.current?.abort();
			abortRef.current = new AbortController();
			summarizerRef.current = await window.Summarizer!.create({
				...options,
			});
		},
		[isSupported]
	);

	const summarize = React.useCallback(async (text: string) => {
		if (!summarizerRef.current) {
			throw new Error('Summarizer instance not created.');
		}
		if (!abortRef.current) {
			abortRef.current = new AbortController();
		}
		try {
			return await summarizerRef.current.summarize(text, {
				signal: abortRef.current.signal,
			});
		} catch (err: unknown) {
			if (isAbortError(err)) {
				return Promise.reject(err);
			}
			throw err;
		}
	}, []);

	const cancel = React.useCallback(() => {
		if (abortRef.current) {
			abortRef.current?.abort();
			abortRef.current = null;
		}
	}, []);

	const destroy = React.useCallback(() => {
		summarizerRef.current?.destroy();
		summarizerRef.current = null;
		cancel();
	}, [cancel]);

	return {
		cancel,
		checkAvailability,
		create,
		destroy,
		isAbortError,
		isSupported,
		summarize,
	};
}
