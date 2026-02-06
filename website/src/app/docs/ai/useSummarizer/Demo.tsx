'use client';

import { useSummarizer } from '@vibehooks/react';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/Button';
import { TextArea } from '@/components/ui/TextArea';
import { Layout } from '@/layouts/Layout';

export default function Demo() {
	const [isMounted, setIsMounted] = useState<boolean>(false);
	const [summary, setSummary] = useState<string | null>(null);
	const [status, setStatus] = useState<string>('');
	const [text, setText] = useState<string>('');
	const {
		cancel,
		checkAvailability,
		create,
		destroy,
		isAbortError,
		isSupported,
		summarize,
	} = useSummarizer();

	const run = async () => {
		try {
			setStatus('checking');

			const availability = await checkAvailability({
				inputLanguage: 'en',
				length: 'long',
				outputLanguage: 'es',
				type: 'tldr',
			});

			if (availability !== 'available') {
				setStatus(`unavailable (${availability})`);
				return;
			}

			setStatus('creating');
			await create({ type: 'tldr' });

			setStatus('summarizing');
			const result = await summarize(text);

			setSummary(result);
			setStatus('done');
		} catch (error: unknown) {
			if (isAbortError(error)) {
				setStatus('idle');
				return;
			}
			setStatus('error');
			console.error(error);
		} finally {
			destroy();
		}
	};

	const handleCancel = () => {
		cancel();
		setStatus('idle');
	};

	const handleChangeText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setText(event.target.value);
	};

	useEffect(() => {
		setTimeout(() => {
			setIsMounted(true);
		}, 100);
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
					The Summarizer API is not supported in this browser.
				</Layout.ContentNotSupported>
			</Layout>
		);
	}

	return (
		<Layout>
			<Layout.Title>Summarizer AI</Layout.Title>
			<Layout.Caption>Status: {status}</Layout.Caption>
			<TextArea.Primary
				onChange={handleChangeText}
				placeholder='Enter text here...'
				value={text}
			/>
			<div className='flex flex-row items-center gap-2'>
				<Button.Primary
					disabled={!isSupported || status === 'summarizing'}
					onClick={run}
				>
					Summarize
				</Button.Primary>
				<Button.Destructive
					disabled={status !== 'summarizing'}
					onClick={handleCancel}
				>
					Cancel
				</Button.Destructive>
			</div>
			<Layout.Paragraph>{summary}</Layout.Paragraph>
		</Layout>
	);
}
