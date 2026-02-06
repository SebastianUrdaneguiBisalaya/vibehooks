import * as React from 'react';

export interface ListReturn<T> {
	insert: (idx: number, item: T) => void;
	items: T[];
	push: (item: T) => void;
	remove: (idx: number) => void;
	update: (idx: number, item: T) => void;
}

/**
 * `useList` is a custom hook that allows you to create, update, and delete items in a list.
 *
 * @example
 * ```tsx
 * const { items, insert, push, remove, update } = useList<string>(['item1', 'item2']);
 * ```
 */
export function useList<T>(defaultValue: T[] = []): ListReturn<T> {
	const [items, setItems] = React.useState<T[]>(defaultValue || []);

	const insert = React.useCallback((idx: number, item: T) => {
		setItems(prevItems => {
			const copy = [...prevItems];
			copy.splice(idx, 0, item);
			return copy;
		});
	}, []);

	const push = React.useCallback((item: T) => {
		setItems(prevItems => [...prevItems, item]);
	}, []);

	const remove = React.useCallback((idx: number) => {
		setItems(prevItems => {
			const copy = [...prevItems];
			copy.splice(idx, 1);
			return copy;
		});
	}, []);

	const update = React.useCallback((idx: number, item: T) => {
		setItems(prevItems => {
			const copy = [...prevItems];
			copy[idx] = item;
			return copy;
		});
	}, []);

	return {
		insert,
		items,
		push,
		remove,
		update,
	};
}
