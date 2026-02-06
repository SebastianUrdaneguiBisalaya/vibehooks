'use client';

import { useScreenWakeLock } from '@vibehooks/react';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';
import { Layout } from '@/layouts/Layout';

export default function Demo() {
	const { isActive, isSupported, release, request } = useScreenWakeLock();
	const [isMounted, setIsMounted] = useState<boolean>(false);

	useEffect(() => {
		setTimeout(() => {
			setIsMounted(true);
		}, 100);
	}, []);

	useEffect(() => {
		return () => {
			release();
		};
	}, [release]);

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
					The Screen Wake Lock API is not supported in this browser.
				</Layout.ContentNotSupported>
			</Layout>
		);
	}

	const toggleWakeLock = async () => {
		if (isActive) {
			await release();
		} else {
			await request();
		}
	};

	return (
		<Layout>
			<Layout.Title>Screen Wake Lock</Layout.Title>
			<Tag.Primary>Status: {isActive ? 'Active' : 'Inactive'}</Tag.Primary>
			<Button.Primary onClick={toggleWakeLock}>
				{isActive ? 'Release Wake Lock' : 'Request Wake Lock'}
			</Button.Primary>
			<Layout.Caption>
				{isActive
					? 'Your screen is now prevented from dimming or locking.'
					: 'Enable wake lock to keep your screen active during use.'}
			</Layout.Caption>
		</Layout>
	);
}
