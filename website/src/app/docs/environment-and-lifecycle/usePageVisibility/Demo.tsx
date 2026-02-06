'use client';

import { usePageVisibility } from '@vibehooks/react';

import { Tag } from '@/components/ui/Tag';
import { Layout } from '@/layouts/Layout';

export default function Demo() {
	const { isVisible, visibilityState } = usePageVisibility();
	return (
		<Layout>
			<Layout.Title>Page Visibility</Layout.Title>
			<Tag.Primary>Status: {visibilityState}</Tag.Primary>
			<Layout.Caption>{isVisible ? 'Visible ✅' : 'Hidden ❌'}</Layout.Caption>
			<Layout.Caption>
				Try switching tabs and coming back to see the state change.
			</Layout.Caption>
		</Layout>
	);
}
