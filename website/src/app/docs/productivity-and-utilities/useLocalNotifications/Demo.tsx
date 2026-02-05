'use client';

import { useState, useEffect } from 'react';

import { useLocalNotifications } from '../../../../../../src';
import { Button } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';
import { Layout } from '@/layouts/Layout';

export default function Demo() {
	const { isSupported, notify, permission, requestPermission } =
		useLocalNotifications();
	const [isMounted, setIsMounted] = useState<boolean>(false);

	useEffect(() => {
		setTimeout(() => {
			setIsMounted(true);
		}, 100);
	}, []);

	const handleAlert = () => {
		notify({
			body: 'This a local browser notification.',
			title: 'Local Notification',
		});
	};

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
					The Notifications API is not supported in this browser.
				</Layout.ContentNotSupported>
			</Layout>
		);
	}

	return (
		<Layout>
			<Layout.Title>Local Notifications</Layout.Title>
			<Tag.Primary>Status: {isSupported ? '✅' : '❌'}</Tag.Primary>
			<Tag.Primary>Permission: {permission}</Tag.Primary>
			<div className='w-full flex flex-col md:flex-row items-center justify-center gap-4'>
				<Button.Secondary onClick={requestPermission}>
					Grant permission
				</Button.Secondary>
				<Button.Primary
					disabled={permission !== 'granted'}
					onClick={handleAlert}
				>
					Send notification
				</Button.Primary>
			</div>
		</Layout>
	);
}
