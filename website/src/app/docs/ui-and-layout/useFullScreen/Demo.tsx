'use client';

import { useFullscreen } from '@vibehooks/react';
import { useRef } from 'react';

import { Button } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';
import { Layout } from '@/layouts/Layout';

export default function Demo() {
	const ref = useRef<HTMLDivElement>(null);
	const { isFullscreen, toggle } = useFullscreen<HTMLDivElement>(ref);

	return (
		<Layout>
			<Layout.Title>Fullscreen</Layout.Title>
			<div
				className='w-full flex flex-col items-center justify-center gap-2'
				ref={ref}
			>
				<Tag.Primary>
					Status: {isFullscreen ? 'Fullscreen' : 'Normal'}
				</Tag.Primary>
				<Button.Primary onClick={toggle}>Toggle Fullscreen</Button.Primary>
			</div>
		</Layout>
	);
}
