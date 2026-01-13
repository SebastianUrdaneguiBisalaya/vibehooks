import * as React from 'react';

type AsyncState<T> = {
	data: T | null;
	error: Error | null;
	isLoading: boolean;
	isSuccess: boolean;
	isError: boolean;
	isIdle: boolean;
};

type FetchConfig = RequestInit & {
	params?: Record<string, string | number | boolean>;
	timeout?: number;
	retries?: number;
	retryDelay?: number;
	onSuccess?: (data: any) => void;
	onError?: (error: Error) => void;
};

type UseAsyncStateReturn<T> = AsyncState<T> & {
	execute: (url: string, config?: FetchConfig) => Promise<T | null>;
	reset: () => void;
	mutate: (data: T) => void;
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
	onSuccess?: (data: T) => void;
	onError?: (error: Error) => void;
}

/**
 * `useAsyncState` is a comprehensive hook for managing asynchronous fetch operations with built-in state management.
 * This hook eliminates the need to manually manage loading state, errors, retries, and data handling for fetch requests.
 *
 * @template T - The expected type of the response data.
 *
 * @param options - Configuration options for the hook.
 *
 * @returns An object containing the following properties:
 * - `data`: The fetched data or null
 * - `error`: Any error that occurred or null
 * - `isLoading`: True when a request is in progress
 * - `isSuccess`: True when the last request succeeded
 * - `isError`: True when the last request failed
 * - `isIdle`: True when no request has been made yet
 * - `execute`: Function to trigger the fetch request
 * - `reset`: Function to reset all state to initial values
 * - `mutate`: Function to manually update the data (optimistic updates)
 * - `retry`: Function to retry the last failed request
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
 * @example
 * ```tsx
 * // POST request with error handling and retry
 * function CreatePost() {
 *   const {
 *     data,
 *     isLoading,
 *     isError,
 *     error,
 *     execute,
 *     retry
 *   } = useAsyncState<Post>({
 *     onSuccess: (post) => {
 *       console.log('Post created:', post);
 *       toast.success('Post published!');
 *     },
 *     onError: (err) => {
 *       console.error('Failed to create post:', err);
 *     }
 *   });
 *
 *   const handleSubmit = async (formData: PostFormData) => {
 *     await execute('https://api.example.com/posts', {
 *       method: 'POST',
 *       headers: {
 *         'Content-Type': 'application/json',
 *         'Authorization': `Bearer ${token}`
 *       },
 *       body: JSON.stringify(formData),
 *       retries: 3,
 *       retryDelay: 1000,
 *       timeout: 5000
 *     });
 *   };
 *
 *   return (
 *     <form onSubmit={(e) => {
 *       e.preventDefault();
 *       handleSubmit(formData);
 *     }}>
 *       <input name="title" />
 *       <button type="submit" disabled={isLoading}>
 *         {isLoading ? 'Publishing...' : 'Publish'}
 *       </button>
 *       {isError && (
 *         <div>
 *           <p>Error: {error?.message}</p>
 *           <button onClick={retry}>Retry</button>
 *         </div>
 *       )}
 *     </form>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With query parameters and optimistic updates
 * function TodoList() {
 *   const {
 *     data: todos,
 *     isLoading,
 *     execute,
 *     mutate
 *   } = useAsyncState<Todo[]>({ initialData: [] });
 *
 *   const fetchTodos = () => {
 *     execute('https://api.example.com/todos', {
 *       params: {
 *         status: 'active',
 *         limit: 20,
 *         sort: 'createdAt'
 *       }
 *     });
 *   };
 *
 *   const toggleTodo = async (id: string) => {
 *     // Optimistic update
 *     const updated = todos?.map(todo =>
 *       todo.id === id ? { ...todo, done: !todo.done } : todo
 *     ) || [];
 *     mutate(updated);
 *
 *     // Actual API call
 *     try {
 *       await execute(`https://api.example.com/todos/${id}`, {
 *         method: 'PATCH',
 *         headers: { 'Content-Type': 'application/json' },
 *         body: JSON.stringify({ done: !todos?.find(t => t.id === id)?.done })
 *       });
 *     } catch (err) {
 *       // Revert on error
 *       mutate(todos);
 *     }
 *   };
 *
 *   React.useEffect(() => {
 *     fetchTodos();
 *   }, []);
 *
 *   return (
 *     <ul>
 *       {todos?.map(todo => (
 *         <li key={todo.id} onClick={() => toggleTodo(todo.id)}>
 *           {todo.title}
 *         </li>
 *       ))}
 *     </ul>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Advanced usage with all features
 * function AdvancedExample() {
 *   const {
 *     data,
 *     error,
 *     isLoading,
 *     isError,
 *     isSuccess,
 *     execute,
 *     reset,
 *     retry
 *   } = useAsyncState<ApiResponse>({
 *     initialData: null,
 *     onSuccess: (data) => {
 *       analytics.track('api_success', { endpoint: data.endpoint });
 *     },
 *     onError: (error) => {
 *       if (error instanceof FetchError && error.status === 401) {
 *         redirectToLogin();
 *       }
 *     }
 *   });
 *
 *   const makeRequest = async () => {
 *     await execute('https://api.example.com/data', {
 *       method: 'GET',
 *       headers: {
 *         'Authorization': `Bearer ${getToken()}`,
 *         'X-Custom-Header': 'value'
 *       },
 *       params: {
 *         page: 1,
 *         perPage: 50,
 *         filter: 'active'
 *       },
 *       timeout: 10000,      // 10 second timeout
 *       retries: 3,          // Retry 3 times on failure
 *       retryDelay: 2000,    // Wait 2 seconds between retries
 *     });
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={makeRequest}>Fetch Data</button>
 *       <button onClick={reset}>Reset</button>
 *
 *       {isLoading && <Spinner />}
 *       {isError && (
 *         <ErrorMessage
 *           message={error?.message}
 *           onRetry={retry}
 *         />
 *       )}
 *       {isSuccess && data && <DataDisplay data={data} />}
 *     </div>
 *   );
 * }
 * ```
 *
 * @author Sebastian Marat Urdanegui Bisalaya <https://sebastianurdanegui.com>
 *
 * @since 0.0.1
 * @version 0.0.1
 *
 */
export function useAsyncState<T>(
	options?: UseAsyncStateOptions<T>
): UseAsyncStateReturn<T> {
	const { initialData = null, onSuccess, onError } = options || {};

	const [state, setState] = React.useState<AsyncState<T>>({
		data: initialData,
		error: null,
		isLoading: false,
		isSuccess: false,
		isError: false,
		isIdle: true,
	});

	const lastRequestRef = React.useRef<{
		url: string;
		config: FetchConfig | undefined;
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
				params,
				timeout = 30000,
				retries = 0,
				retryDelay = 1000,
				onSuccess: configOnSuccess,
				onError: configOnError,
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
			lastRequestRef.current = { url, config };

			setState(prev => ({
				...prev,
				isLoading: true,
				isSuccess: false,
				isError: false,
				isIdle: false,
				error: null,
			}));

			try {
				const data = await performFetch(url, config);
				setState({
					data,
					error: null,
					isLoading: false,
					isSuccess: true,
					isError: false,
					isIdle: false,
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
					isLoading: false,
					isSuccess: false,
					isError: true,
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
			isLoading: false,
			isSuccess: false,
			isError: false,
			isIdle: true,
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
		const { url, config } = lastRequestRef.current;
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
		reset,
		mutate,
		retry,
	};
}
