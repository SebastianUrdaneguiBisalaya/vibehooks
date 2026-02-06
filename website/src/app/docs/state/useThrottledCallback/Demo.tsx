'use client';

import { useThrottledCallback } from '@vibehooks/react/index';
import { useState } from 'react';

import { Layout } from '@/layouts/Layout';

export default function Demo() {
	const [rawCount, setRawCount] = useState<number>(0);
	const [throttledCount, setThrottledCount] = useState<number>(0);

	const throttledHandler = useThrottledCallback(
		() => {
			setThrottledCount(prevCount => prevCount + 1);
		},
		{ delay: 100 }
	);

	const handleMouseMove = () => {
		setRawCount(prevCount => prevCount + 1);
		throttledHandler();
	};
	return (
		<Layout>
			<Layout.Title>Throttled Callback</Layout.Title>
			<div
				className='h-32 w-full bg-black/40 rounded-xl flex flex-col items-center justify-center border border-dashed border-white/20 cursor-crosshair group transition-colors hover:border-white/90'
				onMouseMove={handleMouseMove}
			>
				<Layout.Paragraph>Move mouse here</Layout.Paragraph>
				<Layout.Caption>Check the counters below</Layout.Caption>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
				<div className='p-4 bg-black/40 border border-white/20 rounded-lg shadow-sm'>
					<Layout.Caption>Raw events</Layout.Caption>
					<Layout.Paragraph>{rawCount}</Layout.Paragraph>
					<Layout.Caption>Updating ~60-120fps</Layout.Caption>
				</div>

				<div className='p-4 bg-black/40 border border-white/20 rounded-lg shadow-sm'>
					<Layout.Caption>Throttled (100ms)</Layout.Caption>
					<Layout.Paragraph>{throttledCount}</Layout.Paragraph>
					<Layout.Caption>Max 10 updates per second</Layout.Caption>
				</div>
			</div>
		</Layout>
	);
}
