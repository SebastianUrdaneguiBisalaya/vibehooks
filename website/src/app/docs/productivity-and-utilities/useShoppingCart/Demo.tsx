'use client';

import { useShoppingCart } from '../../../../../../src';
import { Button } from '@/components/ui/Button';
import { Layout } from '@/layouts/Layout';

export interface Product {
	id: string;
	name: string;
	price: number;
	quantity: number;
}

export default function Demo() {
	const {
		addItem,
		clear,
		getDetails,
		getItemCount,
		getTotal,
		getTotalQuantity,
	} = useShoppingCart<Product>({
		getItemKey: item => item.id,
		getItemPrice: item => item.price,
		getItemQuantity: item => item.quantity,
	});

	const addDummy = () => {
		addItem({
			id: Date.now().toString(),
			name: 'Product',
			price: 100,
			quantity: 1,
		});
	};

	return (
		<Layout>
			<Layout.Title>Shopping Cart</Layout.Title>
			<div className='flex flex-row items-center justify-center gap-2'>
				<Button.Secondary onClick={addDummy}>Add $100 Item</Button.Secondary>
				<Button.Warning onClick={clear}>Clear</Button.Warning>
			</div>

			<div className='flex flex-col items-center w-full gap-2'>
				<Layout.Caption>Items in cart: {getItemCount()}</Layout.Caption>
				<Layout.Caption>Total Quantity: {getTotalQuantity()}</Layout.Caption>
				<Layout.Caption>
					<b>Total Amount: ${getTotal()}</b>
				</Layout.Caption>
			</div>

			<div className='w-full flex flex-col items-center gap-1.5'>
				<Layout.Caption>Details</Layout.Caption>
				{getDetails().map(detail => (
					<div
						className='font-reddit-sans text-sm text-white/90'
						key={detail.key}
					>
						<Layout.Caption>
							Item {detail.key}: {detail.quantity} x ${detail.unitPrice} ={' '}
							<b>${detail.total}</b>
						</Layout.Caption>
					</div>
				))}
			</div>
		</Layout>
	);
}
