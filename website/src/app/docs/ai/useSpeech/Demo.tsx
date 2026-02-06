'use client';

import { useSpeech } from '@vibehooks/react';

import { Button } from '@/components/ui/Button';
import { TextArea } from '@/components/ui/TextArea';
import { Layout } from '@/layouts/Layout';

export default function Demo() {
	const { error, reset, start, status, stop, transcript } = useSpeech({
		continuous: true,
		interimResults: true,
		lang: 'en-PE',
	});

	if (status === 'unsupported') {
		return (
			<Layout>
				<Layout.ContentNotSupported>
					Speech API is not supported in this browser.
				</Layout.ContentNotSupported>
			</Layout>
		);
	}
	return (
		<Layout>
			<Layout.Title>Speech AI</Layout.Title>
			<Layout.Caption>Status: {status}</Layout.Caption>
			{error && <Layout.Error>Error: {error?.message}</Layout.Error>}
			<div className='flex flex-row gap-2'>
				<Button.Primary onClick={start}>Start</Button.Primary>
				<Button.Warning onClick={stop}>Stop</Button.Warning>
				<Button.Destructive onClick={reset}>Cancel</Button.Destructive>
			</div>
			<TextArea.Primary
				placeholder='Transcript will appear here...'
				readOnly
				value={transcript}
			/>
		</Layout>
	);
}
