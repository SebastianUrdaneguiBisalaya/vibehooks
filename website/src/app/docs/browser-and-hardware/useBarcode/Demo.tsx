'use client';

import { useState, useEffect, useRef } from 'react';

import { useBarcode } from '../../../../../../src';
import { Button } from '@/components/ui/Button';
import { Layout } from '@/layouts/Layout';

export default function Demo() {
	const [isMounted, setIsMounted] = useState<boolean>(false);
	const videoRef = useRef<HTMLVideoElement>(null);
	const seenRef = useRef<Set<string>>(new Set());
	const [codes, setCodes] = useState<DetectorBarcode[]>([]);

	const { current, start, stop, supported } = useBarcode({
		elementRef: videoRef,
		formats: ['qr_code', 'ean_13', 'code_128'],
		onDetect: barcode => {
			const key = `${barcode.format}-${barcode.rawValue}`;
			if (seenRef.current.has(key)) return;
			seenRef.current.add(key);
			setCodes(codes => [...codes, barcode]);
		},
	});

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

	if (!supported) {
		return (
			<Layout>
				<Layout.ContentNotSupported>
					The Barcode API is not supported in this browser.
				</Layout.ContentNotSupported>
			</Layout>
		);
	}

	return (
		<Layout>
			<div className='relative overflow-hidden rounded-md bg-black aspect-video'>
				<video
					className='w-full h-full object-cover'
					muted
					playsInline
					ref={videoRef}
				/>
			</div>

			<div className='flex flex-row items-center gap-2'>
				<Button.Primary onClick={start}>Start</Button.Primary>
				<Button.Secondary onClick={stop}>Stop</Button.Secondary>
			</div>

			{current && (
				<div className='flex flex-row gap-2 items-center justify-center w-full'>
					<Layout.Caption>Detected last code:</Layout.Caption>
					<Layout.Paragraph>{current.rawValue}</Layout.Paragraph>
				</div>
			)}

			{codes.length > 0 && (
				<div className='w-full flex flex-col items-center gap-2'>
					<Layout.Caption>Detected codes:</Layout.Caption>
					<Layout.Paragraph>
						{codes.map(word => `"${word}"`).join(', ')}
					</Layout.Paragraph>
				</div>
			)}

			<Layout.Caption>
				Point your camera at a QR code or barcode to see the result.
			</Layout.Caption>
		</Layout>
	);
}
