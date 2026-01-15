import * as React from 'react';

export type SummarizerAvailability =
	| 'available'
	| 'unavailable'
	| 'downloadable';

export type SummarizerType = 'tldr' | 'key-points' | 'headline' | 'paragraph';

export type SummarizerFormat = 'plain-text' | 'markdown';

export type SummarizerLength = 'short' | 'medium' | 'long';

export interface SummarizerCreateOptions {
	type?: SummarizerType;
	format?: SummarizerFormat;
	length?: SummarizerLength;
	inputLanguage?: string;
	outputLanguage?: string;
	signal?: AbortSignal;
}

export interface BrowserSummarizer {
	summarize(text: string, options?: { signal?: AbortSignal }): Promise<string>;
	destroy(): void;
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
	 * Indicates whether the Summarizer API exists in the current environment.
	 */
	isSupported: boolean;

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
	 * Runs a sumamrization request using the active Summarizer instance.
	 */
	summarize(text: string, options?: { signal?: AbortSignal }): Promise<string>;

	/**
	 * Cancels any pending create or summarize operation.
	 */
	cancel(): void;

	/**
	 * Destroys the active Summarizer instance.
	 */
	destroy(): void;
}

/**
 * `useSummarizer` is React hook that provides low-level access to the browser Summarizer API.
 *
 * @returns Summarizer controls and helpers.
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
 * @since 0.0.1
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
				signal: abortRef.current.signal,
			});
		},
		[isSupported]
	);

	const summarize = React.useCallback(
		async (text: string, options?: { signal?: AbortSignal }) => {
			if (!summarizerRef.current) {
				throw new Error('Summarizer instance not created.');
			}
			return summarizerRef.current.summarize(text, options);
		},
		[]
	);

	const cancel = React.useCallback(() => {
		abortRef.current?.abort();
		abortRef.current = null;
	}, []);

	const destroy = React.useCallback(() => {
		summarizerRef.current?.destroy();
		summarizerRef.current = null;
		cancel();
	}, [cancel]);

	return {
		isSupported,
		checkAvailability,
		create,
		summarize,
		cancel,
		destroy,
	};
}
