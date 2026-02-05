'use client';

import { useState, useEffect } from 'react';

import { useExternalNotifications } from '../../../../../../src';
import { Button } from '@/components/ui/Button';
import { Layout } from '@/layouts/Layout';

export default function Demo() {
	const { isSupported, notifications, notify, permission, requestPermission } =
		useExternalNotifications();
	const [isMounted, setIsMounted] = useState<boolean>(false);

	useEffect(() => {
		setTimeout(() => {
			setIsMounted(true);
		}, 100);
	}, []);

	const handleAlert = () => {
		notify({
			body: 'External notification triggered!',
			title: 'New Update',
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
			<Layout.Title>External Notifications</Layout.Title>
			<div className='w-full flex flex-row items-center justify-center gap-4'>
				<Button.Secondary
					disabled={permission !== 'granted'}
					onClick={requestPermission}
				>
					Grant permission
				</Button.Secondary>
				<Button.Primary onClick={handleAlert}>
					Send external notification
				</Button.Primary>
			</div>
			<div className='flex flex-col w-full items-center gap-2'>
				<Layout.Caption>Notification history</Layout.Caption>
				<div className='flex flex-col w-full items-center gap-1'>
					{notifications?.map(n => (
						<div
							className='font-reddit-sans text-sm text-white/80 text-center w-full'
							key={n.createdAt}
						>
							<Layout.Caption>
								{n.title} - {new Date(n.createdAt).toLocaleTimeString()}
							</Layout.Caption>
						</div>
					))}
				</div>
			</div>
		</Layout>
	);
}
