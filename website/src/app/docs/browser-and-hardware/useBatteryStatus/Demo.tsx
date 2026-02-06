'use client';

import { useBatteryStatus } from '@vibehooks/react/useBatteryStatus';
import { useState, useEffect } from 'react';

import { Tag } from '@/components/ui/Tag';
import { Layout } from '@/layouts/Layout';

export default function Demo() {
	const [isMounted, setIsMounted] = useState<boolean>(false);
	const { battery, isSupported } = useBatteryStatus();

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
					The Battery Status API is not supported in this browser.
				</Layout.ContentNotSupported>
			</Layout>
		);
	}

	const { charging, chargingTime, dischargingTime, level } = battery;

	const percentage = level !== null ? Math.round(level * 100) : 0;

	return (
		<Layout>
			<div className='flex flex-col items-center'>
				<Layout.Title>System Battery</Layout.Title>
				<Layout.Caption>Real-time hardware telemetry</Layout.Caption>
			</div>
			<Tag.Primary>{charging ? 'Charging' : 'On Battery'}</Tag.Primary>
			<div className='flex flex-col items-center gap-1'>
				<p className='text-4xl font-bold text-white/90 font-sora'>
					{percentage}%
				</p>
				<p className='text-xs text-white/70 font-reddit-sans'>
					Current Capacity
				</p>
			</div>

			<div className='flex flex-col items-center gap-1'>
				{charging && chargingTime !== Infinity && (
					<Layout.Caption>
						Full in: {Math.round(chargingTime ?? 0 / 60)} mins
					</Layout.Caption>
				)}
				{!charging && dischargingTime !== Infinity && (
					<Layout.Caption>
						Left: {Math.round(dischargingTime ?? 0 / 60)} mins
					</Layout.Caption>
				)}
			</div>
		</Layout>
	);
}
