import * as React from 'react';

export interface ObjectList<T extends Record<string, unknown>> {
	defaultValue?: T[];
}

export interface ObjectListReturn<T extends Record<string, unknown>> {
	items: T[];
	insert: (idx: number, item: T) => void;
	push: (item: T) => void;
	remove: (idx: number) => void;
	update: (idx: number, item: T) => void;
	updatePartial: (idx: number, partial: Partial<T>) => void;
	find: (predicate: (item: T, idx: number) => boolean) => T | undefined;
	findIndex: (predicate: (item: T, idx: number) => boolean) => number;
	filter: (predicate: (item: T, idx: number) => boolean) => T[];
	some: (predicate: (item: T, idx: number) => boolean) => boolean;
	every: (predicate: (item: T, idx: number) => boolean) => boolean;
	map: <U>(mapper: (item: T, idx: number) => U) => U[];
}

/**
 * `useObjectList` is a custom hook for managing a list of plain objects. It supports insertion, removal, full replacement updates, and shallow partial updates via object spreading.
 *
 * @typeParam T A plain object type (key-value record).
 *
 * @param defaultValue - Initial list of objects.
 * @returns An API for managing the object list:
 * - `insert`: insert an item at a specific index
 * - `push`: append an item to the end of the list
 * - `remove`: remove an item by index
 * - `update`: replace an item entirely
 * - `updatePartial`: shallow-merge specific fields into an existing item
 * - `find`: find the first item that matches the predicate
 * - `findIndex`: find the index of the first item that matches the predicate
 * - `filter`: filter the list based on the predicate
 * - `some`: check if any item in the list matches the predicate
 * - `every`: check if all items in the list match the predicate
 * - `map`: map the list to a new array based on the mapper function
 *
 * @example
 * ```tsx
 * type Item = { id: number; name: string; active: boolean };
 *
 * const {
 *   items,
 *   insert,
 *   push,
 *   remove,
 *   update,
 *   updatePartial,
 *   find,
 *   findIndex,
 *   filter,
 *   some,
 *   every,
 *   map,
 * } = useObjectList<Item>({
 *   defaultValue: [
 *     { id: 1, name: 'item1', active: true },
 *     { id: 2, name: 'item2', active: false },
 *   ],
 * });
 *
 * updatePartial(0, { active: false });
 * ```
 *
 * @author Sebastian Marat Urdanegui Bisalaya <https://sebastianurdanegui.com>
 *
 * @since 0.0.1
 * @version 0.0.1
 *
 */
export function useObjectList<T extends Record<string, unknown>>({
	defaultValue,
}: ObjectList<T>): ObjectListReturn<T> {
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

	const updatePartial = React.useCallback(
		(idx: number, partial: Partial<T>) => {
			setItems(prevItems => {
				const copy = [...prevItems];
				const current = copy[idx];
				copy[idx] = Object.assign({}, current, partial) as T;
				return copy;
			});
		},
		[]
	);

	const find = (predicate: (item: T, idx: number) => boolean) => {
		return items.find(predicate);
	};

	const findIndex = (predicate: (item: T, idx: number) => boolean) => {
		return items.findIndex(predicate);
	};

	const filter = (predicate: (item: T, idx: number) => boolean) => {
		return items.filter(predicate);
	};

	const some = (predicate: (item: T, idx: number) => boolean) => {
		return items.some(predicate);
	};

	const every = (predicate: (item: T, idx: number) => boolean) => {
		return items.every(predicate);
	};

	const map = <U>(mapper: (item: T, idx: number) => U) => {
		return items.map(mapper);
	};

	return {
		items,
		insert,
		push,
		remove,
		update,
		updatePartial,
		find,
		findIndex,
		filter,
		some,
		every,
		map,
	};
}
