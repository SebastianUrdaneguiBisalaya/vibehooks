'use client';

import { useIsClient } from '@vibehooks/react';

import { Tag } from '@/components/ui/Tag';
import { Layout } from '@/layouts/Layout';

export default function Demo() {
	const isClient = useIsClient();
	return (
		<Layout>
			<Layout.Title>Is Client?</Layout.Title>
			<div className='flex flex-col items-center gap-1.5'>
				<Layout.Caption>Current environment</Layout.Caption>
				<Tag.Primary>{isClient ? 'Client-side' : 'Server-side'}</Tag.Primary>
			</div>
		</Layout>
	);
}
