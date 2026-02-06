import * as React from 'react';

export interface Task<T = unknown> {
	id: string;
	run: () => Promise<T>;
}

export interface UseTaskQueueReturn<T = unknown> {
	enqueue: (task: Task<T>) => void;
	queue: Task<T>[];
	running: boolean;
}

/**
 * `useTaskQueue` is a React hook that manages a queue of async tasks with concurrency control.
 *
 * @example
 * ```tsx
 * const { enqueue, running, queue } = useTaskQueue();
 *
 * React.useEffect(() => {
 *   enqueue({ id: 'task1', run: async () => console.log('Task 1') });
 * }, []);
 * ```
 */
export function useTaskQueue<T = unknown>(): UseTaskQueueReturn<T> {
	const [queue, setQueue] = React.useState<Task<T>[]>([]);
	const [running, setRunning] = React.useState<boolean>(false);

	const isProcessingRef = React.useRef<boolean>(false);

	React.useEffect(() => {
		if (queue.length === 0) {
			setRunning(false);
			return;
		}

		if (isProcessingRef.current) return;
		isProcessingRef.current = true;

		const task = queue[0];
		setRunning(true);

		const run = async () => {
			try {
				await task?.run();
			} catch (error: unknown) {
				console.error(error);
			} finally {
				isProcessingRef.current = false;
				setQueue(prev => prev.slice(1));
			}
		};
		run();
	}, [queue]);

	const enqueue = React.useCallback((task: Task<T>) => {
		setQueue(prev => [...prev, task]);
	}, []);

	return {
		enqueue,
		queue,
		running,
	};
}
