'use client';

import { useServerSentEvent } from '../../../../../../src';
import { Button } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';
import { Layout } from '@/layouts/Layout';

export default function Demo() {
	const { close, readyState } = useServerSentEvent(
		'https://echo.websocket.org/.sse'
	);
	return (
		<Layout>
			<Layout.Title>Server-Sent Event</Layout.Title>
			<Tag.Primary>Status: {readyState}</Tag.Primary>
			<Button.Destructive onClick={close}>Close</Button.Destructive>
		</Layout>
	);
}
