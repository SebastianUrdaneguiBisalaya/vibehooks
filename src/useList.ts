import * as React from 'react';

export interface List<T> {
    defaultValue?: T[];
}

export interface ListReturn<T> {
    items: T[];
    add: (idx: number, item: T) => void;
    push: (item: T) => void;
    remove: (idx: number) => void;
    update: (idx: number, item: T) => void;
}

/**
 * `useList` is a custom hook that allows you to create, update, and delete items in a list.
 *
 * @typeParam T Type of the items in the list.
 * 
 * @param defaultValue - An array of default values to initialize the list with.
 * @returns An object containing the list items, methods to push, remove, and update items by index, and a method to add items to the end of the list.
 *
 * @example
 * ```tsx
 * const { items, add, remove, update } = useList<string>(['item1', 'item2']);
 * ```
 *
 * @author Sebastian Marat Urdanegui Bisalaya <sebastianurdanegui.com>
 *
 * @since 0.0.1
 * @version 0.0.1
 *
 */
export function useList<T>({ defaultValue }: List<T>): ListReturn<T> {
    const [items, setItems] = React.useState<T[]>(defaultValue || []);

    const add = React.useCallback((idx: number, item: T) => {
        setItems(prevItems => {
            const copy = [...prevItems];
            copy.splice(idx, 0, item);
            return copy;
        })
    }, []);

    const push = React.useCallback((item: T) => {
        setItems(prevItems => [...prevItems, item]);
    }, []);

    const remove = React.useCallback((idx: number) => {
        setItems(prevItems => {
            const copy = [...prevItems];
            copy.splice(idx, 1);
            return copy;
        })
    }, []);

    const update = React.useCallback((idx: number, item: T) => {
        setItems(prevItems => {
            const copy = [...prevItems];
            copy[idx] = item;
            return copy;
        })
    }, []);

    return {
        items,
        add,
        push,
        remove,
        update,
    }
}