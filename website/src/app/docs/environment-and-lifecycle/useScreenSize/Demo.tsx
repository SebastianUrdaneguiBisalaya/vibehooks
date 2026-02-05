'use client';

import { useScreenSize } from '../../../../../../src';
import { Layout } from '@/layouts/Layout';

export default function Demo() {
	const { height, width } = useScreenSize();

	return (
		<Layout>
			<Layout.Title>Screen Size</Layout.Title>
			<div className='flex flex-col items-center max-w-48 w-full rounded-md bg-neutral-900 border border-white/50 border-dashed px-2 py-6'>
				<Layout.Paragraph>
					{width} x {height}
				</Layout.Paragraph>
			</div>
			<Layout.Caption>Resize your browser to see changes</Layout.Caption>
		</Layout>
	);
}
