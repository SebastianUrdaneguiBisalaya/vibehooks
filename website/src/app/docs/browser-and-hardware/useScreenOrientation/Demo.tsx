'use client';

import { useScreenOrientation } from '@vibehooks/react';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/Button';
import { Layout } from '@/layouts/Layout';

export default function Demo() {
	const { angle, isSupported, lock, type, unlock } = useScreenOrientation();
	const [isMounted, setIsMounted] = useState<boolean>(false);

	useEffect(() => {
		setTimeout(() => setIsMounted(true), 100);
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
					The Screen Orientation API is not supported in this browser.
				</Layout.ContentNotSupported>
			</Layout>
		);
	}

	const handleLock = async () => {
		try {
			await lock('landscape');
		} catch (error: unknown) {
			console.error('Error locking screen orientation:', error);
		}
	};

	return (
		<Layout>
			<Layout.Title>Screen Orientation</Layout.Title>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				<div className='flex flex-col items-center p-3 rounded-lg shadow-sm border border-white/20 gap-1'>
					<Layout.Caption className='font-bold'>Current Type</Layout.Caption>
					<Layout.Paragraph>{type || 'Unknown'}</Layout.Paragraph>
				</div>
				<div className='flex flex-col items-center p-3 rounded-lg shadow-sm border border-white/20 gap-1'>
					<Layout.Caption className='font-bold'>Rotation Angle</Layout.Caption>
					<Layout.Paragraph>{angle}°</Layout.Paragraph>
				</div>
			</div>
			<div className='flex flex-col md:flex-row gap-2'>
				<Button.Primary onClick={handleLock}>Force Lock</Button.Primary>
				<Button.Secondary onClick={() => unlock()}>Unlock</Button.Secondary>
			</div>
			<Layout.Caption>
				* Orientation locking usually requires a user gesture or active
				full-screen mode depending on the browser.
			</Layout.Caption>
		</Layout>
	);
}
