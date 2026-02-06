'use client';

import { useNetworkInformation } from '@vibehooks/react';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/Button';
import { Layout } from '@/layouts/Layout';
import { cn } from '@/lib/cn';

export default function Demo() {
	const { downlink, effectiveType, rtt, saveData, supported, type } =
		useNetworkInformation();

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

	if (!supported) {
		return (
			<Layout>
				<Layout.ContentNotSupported>
					The Network Information API is not supported in this browser.
				</Layout.ContentNotSupported>
			</Layout>
		);
	}

	const isSlow = effectiveType === '2g' || effectiveType === 'slow-2g';
	const isDataSaver = saveData === true;
	const shouldOptimize = isSlow || isDataSaver;

	return (
		<Layout>
			<Layout.Title>Adaptive UI</Layout.Title>
			<div className='flex gap-2 items-center'>
				<Badge color={shouldOptimize ? 'orange' : 'green'}>
					{effectiveType?.toUpperCase()}
				</Badge>
				{type && <Badge color='blue'>{type}</Badge>}
			</div>
			<div className='space-y-4'>
				<div className='aspect-video rounded-lg flex items-center justify-center relative overflow-hidden'>
					{shouldOptimize ? (
						<div className='text-center p-4'>
							<Layout.Paragraph>Low-res preview active</Layout.Paragraph>
							<Button.Primary>Load High-res</Button.Primary>
						</div>
					) : (
						<div className='absolute font-reddit-sans inset-0 bg-neutral-950 flex items-center justify-center text-white font-bold'>
							Full HD Media
						</div>
					)}
				</div>
				<div className='grid grid-cols-2 gap-3'>
					<Metric label='Latency' value={`${rtt}ms`} />
					<Metric label='Bandwidth' value={`${downlink} Mb/s`} />
				</div>
				{isDataSaver && (
					<Layout.Caption className='text-amber-500'>
						Data Saver is active: Prefetching disabled
					</Layout.Caption>
				)}
			</div>
		</Layout>
	);
}

function Badge({
	children,
	color,
}: {
	children: React.ReactNode;
	color: string;
}) {
	const colors: Record<string, string> = {
		blue: 'bg-blue-100 text-blue-700',
		green: 'bg-emerald-100 text-emerald-700',
		orange: 'bg-orange-100 text-orange-700',
	};
	return (
		<span
			className={cn(
				'px-2 py-0.5 rounded text-[10px] font-bold font-reddit-sans',
				colors[color]
			)}
		>
			{children}
		</span>
	);
}

function Metric({ label, value }: { label: string; value: string }) {
	return (
		<div className='p-2 space-y-1 rounded border border-white/40 text-center'>
			<Layout.Caption>{label}</Layout.Caption>
			<Layout.Paragraph>{value}</Layout.Paragraph>
		</div>
	);
}
