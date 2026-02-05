'use client';

import { useState, useEffect } from 'react';

import { usePermissions } from '../../../../../../src/usePermissions';
import { Tag } from '@/components/ui/Tag';
import { Layout } from '@/layouts/Layout';

const PERMISSIONS_TO_TRACK: PermissionName[] = [
	'camera',
	'microphone',
	'geolocation',
	'notifications',
];

export default function Demo() {
	const { isSupported, permissions } = usePermissions(PERMISSIONS_TO_TRACK);
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
					The Permissions API is not supported in this browser.
				</Layout.ContentNotSupported>
			</Layout>
		);
	}

	return (
		<Layout>
			<Layout.Title>Browser Permissions Tracker</Layout.Title>
			{isSupported ? (
				<>
					<div className='space-y-3'>
						{PERMISSIONS_TO_TRACK.map(name => {
							const status = permissions[name];

							return (
								<div
									className='flex gap-4 items-center justify-between p-2 border border-white/20 rounded-lg'
									key={name}
								>
									<Layout.Paragraph className='capitalize'>
										{name}
									</Layout.Paragraph>
									<Tag.Primary className='capitalize'>{status}</Tag.Primary>
								</div>
							);
						})}
					</div>

					<Layout.Caption>
						Try changing permissions in your browser settings to see the UI
						update automatically.
					</Layout.Caption>
				</>
			) : (
				<Layout.Error>
					Error: The Permissions API is not supported in this browser.
				</Layout.Error>
			)}
		</Layout>
	);
}
