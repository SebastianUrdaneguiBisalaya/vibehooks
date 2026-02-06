'use client';

import { useHoverIntent } from '@vibehooks/react';

import { Button } from '@/components/ui/Button';
import { Layout } from '@/layouts/Layout';

export default function Demo() {
	const hover = useHoverIntent({
		delay: 150,
		tolerance: 8,
	});
	return (
		<Layout>
			<Layout.Title>Hover Intent</Layout.Title>
			<div className='flex flex-col items-center relative w-full'>
				<Button.Primary {...hover.handlers}>Hover me</Button.Primary>
				{hover.isIntent && (
					<div className='bg-neutral-900 absolute top-full mt-2 rounded-xl border border-white/20 px-3 py-2'>
						<Layout.Caption>Tooltip content 👌</Layout.Caption>
					</div>
				)}
			</div>
		</Layout>
	);
}
