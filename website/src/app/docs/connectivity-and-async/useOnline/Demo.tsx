'use client';

import { useOnline } from '../../../../../../src';
import { Tag } from '@/components/ui/Tag';
import { Layout } from '@/layouts/Layout';

export default function Demo() {
	const { online } = useOnline();
	return (
		<Layout>
			<Layout.Title>Connectivity Monitor</Layout.Title>
			<Tag.Primary>Status: {online ? '🌐 Online' : '🔌 Offline'}</Tag.Primary>
			<Layout.Caption>
				{online
					? 'You are connected to the network. Proceed with requests.'
					: 'Connection lost. Some features may be limited.'}
			</Layout.Caption>
		</Layout>
	);
}
