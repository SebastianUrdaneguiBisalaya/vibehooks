import * as React from 'react';

export type AsyncState<T> = {
	data: T | null;
	error: Error | null;
	isError: boolean;
	isIdle: boolean;
	isLoading: boolean;
	isSuccess: boolean;
};

export type FetchConfig = RequestInit & {
	onError?: (error: Error) => void;
	onSuccess?: (data: unknown) => void;
	params?: Record<string, string | number | boolean>;
	retries?: number;
	retryDelay?: number;
	timeout?: number;
};

export type UseAsyncStateReturn<T> = AsyncState<T> & {
	execute: (url: string, config?: FetchConfig) => Promise<T | null>;
	mutate: (data: T) => void;
	reset: () => void;
	retry: () => Promise<T | null>;
};

class FetchError extends Error {
	constructor(
		message: string,
		public status?: number,
		public statusText?: string,
		public response?: Response
	) {
		super(message);
		this.name = 'FetchError';
	}
}

export interface UseAsyncStateOptions<T> {
	initialData?: T | null;
	onError?: (error: Error) => void;
	onSuccess?: (data: T) => void;
}

/**
 * `useAsyncState` is a comprehensive hook for managing asynchronous fetch operations with built-in state management.
 * This hook eliminates the need to manually manage loading state, errors, retries, and data handling for fetch requests.
 *
 * @example
 * ```tsx
 * function UserProfile() {
 *   const { data, isLoading, isError, error, execute } = useAsyncState<User>();
 *
 *   React.useEffect(() => {
 *     execute('https://api.example.com/user/123');
 *   }, []);
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (isError) return <div>Error: {error?.message}</div>;
 *   if (!data) return null;
 *
 *   return <div>Welcome, {data.name}!</div>;
 * }
 * ```
 *
 * @author Sebastian Marat Urdanegui Bisalaya <https://sebastianurdanegui.com>
 *
 * @version 0.0.1
 *
 */
export function useAsyncState<T>(
	options?: UseAsyncStateOptions<T>
): UseAsyncStateReturn<T> {
	const { initialData = null, onError, onSuccess } = options || {};

	const [state, setState] = React.useState<AsyncState<T>>({
		data: initialData,
		error: null,
		isError: false,
		isIdle: true,
		isLoading: false,
		isSuccess: false,
	});

	const lastRequestRef = React.useRef<{
		config: FetchConfig | undefined;
		url: string;
	} | null>(null);
	const abortControllerRef = React.useRef<AbortController | null>(null);

	const buildUrl = React.useCallback(
		(url: string, params?: Record<string, string | number | boolean>) => {
			if (!params || Object.keys(params).length === 0) return url;

			const urlObj = new URL(url);
			Object.entries(params).forEach(([key, value]) => {
				urlObj.searchParams.append(key, value.toString());
			});
			return urlObj.toString();
		},
		[]
	);

	const performFetch = React.useCallback(
		async (
			url: string,
			config?: FetchConfig,
			attemptNumber: number = 1
		): Promise<T> => {
			const {
				onError: configOnError,
				onSuccess: configOnSuccess,
				params,
				retries = 0,
				retryDelay = 1000,
				timeout = 30000,
				...fetchConfig
			} = config || {};

			abortControllerRef.current = new AbortController();
			const { signal } = abortControllerRef.current;

			const fullUrl = buildUrl(url, params);

			const timeoutPromise = new Promise<never>((_, reject) => {
				setTimeout(() => {
					abortControllerRef.current?.abort();
					reject(new FetchError('Request timeout', undefined, 'Timeout'));
				}, timeout);
			});

			try {
				const response = (await Promise.race([
					fetch(fullUrl, { ...fetchConfig, signal }),
					timeoutPromise,
				])) as Response;

				if (!response.ok) {
					const errorText = await response
						.text()
						.catch(() => response.statusText);
					throw new FetchError(
						errorText || `HTTP Error ${response.status}`,
						response.status,
						response.statusText,
						response
					);
				}

				const contentType = response.headers.get('Content-Type');
				let data: T;

				if (contentType?.includes('application/json')) {
					data = await response.json();
				} else if (contentType?.includes('text/')) {
					data = (await response.text()) as T;
				} else {
					data = (await response.blob()) as T;
				}

				configOnSuccess?.(data);
				onSuccess?.(data);
				return data;
			} catch (err: unknown) {
				const error = err instanceof Error ? err : new Error(String(err));
				if (attemptNumber <= retries && error.name !== 'AbortError') {
					await new Promise(resolve => setTimeout(resolve, retryDelay));
					return performFetch(url, config, attemptNumber + 1);
				}
				configOnError?.(error);
				onError?.(error);
				throw error;
			}
		},
		[buildUrl, onSuccess, onError]
	);

	const execute = React.useCallback(
		async (url: string, config?: FetchConfig): Promise<T | null> => {
			abortControllerRef.current?.abort();
			lastRequestRef.current = { config, url };

			setState(prev => ({
				...prev,
				error: null,
				isError: false,
				isIdle: false,
				isLoading: true,
				isSuccess: false,
			}));

			try {
				const data = await performFetch(url, config);
				setState({
					data,
					error: null,
					isError: false,
					isIdle: false,
					isLoading: false,
					isSuccess: true,
				});
				return data;
			} catch (err: unknown) {
				const error = err instanceof Error ? err : new Error(String(err));
				if (error.name !== 'AbortError') {
					return null;
				}
				setState(prev => ({
					...prev,
					error,
					isError: true,
					isLoading: false,
					isSuccess: false,
				}));
				return null;
			}
		},
		[performFetch]
	);

	const reset = React.useCallback(() => {
		abortControllerRef.current?.abort();
		lastRequestRef.current = null;

		setState({
			data: initialData,
			error: null,
			isError: false,
			isIdle: true,
			isLoading: false,
			isSuccess: false,
		});
	}, [initialData]);

	const mutate = React.useCallback((newData: T | null) => {
		setState(prev => ({
			...prev,
			data: newData,
		}));
	}, []);

	const retry = React.useCallback(async (): Promise<T | null> => {
		if (!lastRequestRef.current) {
			console.warn('No previous request to retry.');
			return null;
		}
		const { config, url } = lastRequestRef.current;
		return execute(url, config);
	}, [execute]);

	React.useEffect(() => {
		return () => {
			abortControllerRef.current?.abort();
		};
	}, []);

	return {
		...state,
		execute,
		mutate,
		reset,
		retry,
	};
}
