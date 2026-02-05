'use client';

import { useState, useEffect } from 'react';

import { useVibration } from '../../../../../../src';
import { Button } from '@/components/ui/Button';
import { Layout } from '@/layouts/Layout';

export default function Demo() {
	const [isMounted, setIsMounted] = useState<boolean>(false);
	const { cancel, isSupported, vibrate } = useVibration();
	const [lastResult, setLastResult] = useState<boolean | null>(null);
	const handleVibrate = (pattern: number | number[]) => {
		const result = vibrate(pattern);
		setLastResult(result);
	};

	useEffect(() => {
		setTimeout(() => {
			setIsMounted(true);
		}, 100);
	}, []);

	if (!isMounted) {
		return (
			<Layout>
				<Layout.ContentLoading />
			</Layout>
		);
	}

	if (!isSupported) {
		return (
			<Layout>
				<Layout.ContentNotSupported>
					The Vibration API is not supported in this browser.
				</Layout.ContentNotSupported>
			</Layout>
		);
	}

	return (
		<Layout>
			<Layout.Title>Vibration API</Layout.Title>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
				<Button.Secondary className='w-full' onClick={() => handleVibrate(200)}>
					Vibrate 200ms
				</Button.Secondary>
				<Button.Secondary
					className='w-full'
					onClick={() => handleVibrate([100, 50, 100])}
				>
					Vibrate pattern [100, 50, 100]
				</Button.Secondary>
				<Button.Secondary
					className='w-full'
					onClick={() => handleVibrate([300, 100, 300, 100, 300])}
				>
					Vibrate long pattern
				</Button.Secondary>
				<Button.Destructive className='w-full' onClick={cancel}>
					Cancel vibration
				</Button.Destructive>
			</div>
			<div className='flex flex-col items-center gap-1 rounded-lg bg-neutral-800 p-2'>
				<Layout.Caption>Last result:</Layout.Caption>
				<Layout.Paragraph>
					{lastResult === null
						? '—'
						: lastResult
							? 'Accepted by the user agent'
							: 'Rejected by the user agent'}
				</Layout.Paragraph>
			</div>
			<Layout.Caption>
				Note: Vibration only occurs if triggered by an explicit user gesture
				(click, tap).
			</Layout.Caption>
		</Layout>
	);
}
