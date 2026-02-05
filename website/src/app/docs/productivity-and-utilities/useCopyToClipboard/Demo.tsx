'use client';

import { useCopyToClipboard } from '../../../../../../src';
import { Button } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';
import { Layout } from '@/layouts/Layout';

export default function Demo() {
	const { copyToClipboard, textCopied } = useCopyToClipboard();
	const sampleText = 'Hello world! ✋🏻';
	return (
		<Layout>
			<Layout.Title>Copy to Clipboard</Layout.Title>
			<Button.Primary onClick={() => copyToClipboard(sampleText)}>
				Copy to clipboard
			</Button.Primary>
			{textCopied && <Tag.Primary>Successfully copied</Tag.Primary>}
		</Layout>
	);
}
