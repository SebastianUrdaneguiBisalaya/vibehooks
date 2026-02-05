'use client';

import { useState, useEffect } from 'react';

import { useBodyScrollFreeze } from '../../../../../../src';
import { Button } from '@/components/ui/Button';
import { Layout } from '@/layouts/Layout';

export default function Demo() {
	const { freeze, unfreeze } = useBodyScrollFreeze();
	const [open, setOpen] = useState<boolean>(false);

	useEffect(() => {
		if (open) {
			freeze({ axis: 'y' });
		} else {
			unfreeze();
		}
	}, [open, freeze, unfreeze]);

	return (
		<Layout>
			<Layout.Title>Body Scroll Freeze</Layout.Title>
			<Button.Primary onClick={() => setOpen(true)}>Open modal</Button.Primary>
			{open && (
				<div className='fixed inset-0 z-50 flex items-center justify-center bg-balck/60 backdrop-blur-md'>
					<div className='flex flex-col items-center gap-3 w-full max-w-md rounded-2xl bg-neutral-950 border border-white/20 p-4'>
						<Layout.Paragraph>
							This modal is blocking the page scroll
						</Layout.Paragraph>
						<Button.Secondary onClick={() => setOpen(false)}>
							Close
						</Button.Secondary>
					</div>
				</div>
			)}
		</Layout>
	);
}
