'use client';

import { useIsFirstRender } from '@vibehooks/react';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/Button';
import { Layout } from '@/layouts/Layout';

export default function Demo() {
	const isFirstRender = useIsFirstRender();
	const [count, setCount] = useState<number>(0);
	const [logs, setLogs] = useState<string[]>([]);

	const handleClick = () => {
		setCount(prevCount => prevCount + 1);
	};

	useEffect(() => {
		if (isFirstRender) return;
		setTimeout(() => {
			setLogs(prev => [...prev, `Count changed to ${count}`]);
		}, 100);
	}, [count, isFirstRender]);

	return (
		<Layout>
			<Layout.Title>Is First Render?</Layout.Title>
			<div className='flex flex-col items-center gap-2 w-full'>
				<Layout.Caption>Click the button to change the count.</Layout.Caption>
				<Button.Primary onClick={handleClick}>Increment</Button.Primary>
			</div>
			<div className='w-full'>
				<div className='flex flex-col items-center gap-2 w-full'>
					{logs.length === 0 && (
						<Layout.Caption>No effects executed yet.</Layout.Caption>
					)}
					{logs.map((log, idx) => (
						<div
							className='font-reddit-sans w-full text-center text-sm text-white/80'
							key={idx}
						>
							<Layout.Caption>{log}</Layout.Caption>
						</div>
					))}
				</div>
			</div>
		</Layout>
	);
}
