import * as React from 'react';

export interface UseShoppingCartOptions<T extends object> {
	getItemDiscount?: (item: T) => number;
	getItemKey: (item: T) => string | number;
	getItemPrice: (item: T) => number;
	getItemQuantity: (item: T) => number;
	getItemTax?: (item: T) => number;
}

export interface ShoppingCartItemDetail {
	discount: number;
	key: string | number;
	quantity: number;
	subtotal: number;
	tax: number;
	total: number;
	unitPrice: number;
}

export interface UseShoppingCartReturn<T extends object> {
	addItem: (item: T) => void;
	clear: () => void;
	getDetails: () => ShoppingCartItemDetail[];
	getItemCount: () => number;
	getSubtotal: () => number;
	getTotal: () => number;
	getTotalDiscount: () => number;
	getTotalQuantity: () => number;
	getTotalTax: () => number;
	items: T[];
	removeItem: (id: number | string) => void;
	updateItem: (id: number | string, patch: Partial<T>) => void;
}

/**
 * `useShoppingCart` is a fully unopinionated React hook for managing shopping cart state.
 * The hook does not assume any data structure; instead, it relies on user-provided extractor functions to derive semantic meaning (identity, price, quantity, taxes, discounts).
 * This design allows the hook to adapt to any domain model while still providing a complete and ergonomic shopping cart API.
 *
 * @example
 * ```tsx
 * const cart = useShoppingCart<Product>({
 *   getItemKey: p => p.id,
 *   getItemPrice: p => p.price,
 *   getItemQuantity: p => p.quantity,
 *   getItemTax: p => p.tax ?? 0,
 *   getItemDiscount: p => p.discount ?? 0,
 * });
 *
 * cart.addItem(product);
 * cart.getTotal();
 * cart.getDetails();
 * ```
 */
export function useShoppingCart<T extends object>(
	options: UseShoppingCartOptions<T>
): UseShoppingCartReturn<T> {
	const {
		getItemDiscount,
		getItemKey,
		getItemPrice,
		getItemQuantity,
		getItemTax,
	} = options;

	const [items, setItems] = React.useState<T[]>([]);

	const addItem = React.useCallback((item: T) => {
		setItems(prevItems => [...prevItems, item]);
	}, []);

	const removeItem = React.useCallback(
		(key: string | number) => {
			setItems(prevItems => prevItems.filter(item => getItemKey(item) !== key));
		},
		[getItemKey]
	);

	const updateItem = React.useCallback(
		(key: string | number, patch: Partial<T>) => {
			setItems(prev =>
				prev.map(item =>
					getItemKey(item) === key ? { ...item, ...patch } : item
				)
			);
		},
		[getItemKey]
	);

	const clear = React.useCallback(() => {
		setItems([]);
	}, []);

	const getItemCount = React.useCallback(() => items.length, [items]);

	const getTotalQuantity = React.useCallback(
		() => items.reduce((acc, item) => acc + getItemQuantity(item), 0),
		[items, getItemQuantity]
	);

	const getSubtotal = React.useCallback(
		() =>
			items.reduce(
				(acc, item) => acc + getItemPrice(item) * getItemQuantity(item),
				0
			),
		[items, getItemPrice, getItemQuantity]
	);

	const getTotalTax = React.useCallback(
		() =>
			getItemTax
				? items.reduce(
						(acc, item) => acc + getItemTax(item) * getItemQuantity(item),
						0
					)
				: 0,
		[items, getItemTax, getItemQuantity]
	);

	const getTotalDiscount = React.useCallback(
		() =>
			getItemDiscount
				? items.reduce(
						(acc, item) => acc + getItemDiscount(item) * getItemQuantity(item),
						0
					)
				: 0,
		[items, getItemDiscount, getItemQuantity]
	);

	const getTotal = React.useCallback(
		() => getSubtotal() + getTotalTax() + getTotalDiscount(),
		[getSubtotal, getTotalTax, getTotalDiscount]
	);

	const getDetails = React.useCallback(() => {
		const map = new Map<string | number, ShoppingCartItemDetail>();

		for (const item of items) {
			const key = getItemKey(item);
			const quantity = getItemQuantity(item);
			const unitPrice = getItemPrice(item);
			const tax = getItemTax ? getItemTax(item) : 0;
			const discount = getItemDiscount ? getItemDiscount(item) : 0;
			const existing = map.get(key);

			if (!existing) {
				const subtotal = quantity * unitPrice;
				const taxTotal = tax * quantity;
				const discountTotal = discount * quantity;

				map.set(key, {
					discount: discountTotal,
					key,
					quantity,
					subtotal,
					tax: taxTotal,
					total: subtotal + taxTotal - discountTotal,
					unitPrice,
				});
			} else {
				existing.quantity += quantity;
				const subtTotalIncrement = quantity * unitPrice;
				const taxIncrement = tax * quantity;
				const discountIncrement = discount * quantity;

				existing.subtotal += subtTotalIncrement;
				existing.tax += taxIncrement;
				existing.discount += discountIncrement;
				existing.total += subtTotalIncrement + taxIncrement - discountIncrement;
			}
		}
		return Array.from(map.values());
	}, [
		items,
		getItemKey,
		getItemPrice,
		getItemQuantity,
		getItemTax,
		getItemDiscount,
	]);

	return {
		addItem,
		clear,
		getDetails,
		getItemCount,
		getSubtotal,
		getTotal,
		getTotalDiscount,
		getTotalQuantity,
		getTotalTax,
		items,
		removeItem,
		updateItem,
	};
}
