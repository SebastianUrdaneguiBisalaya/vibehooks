'use client';

import { useTranslator } from '@vibehooks/react';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/Button';
import { TextArea } from '@/components/ui/TextArea';
import { Layout } from '@/layouts/Layout';

export default function Demo() {
	const {
		checkLanguageSupport,
		error,
		isLanguagePairSupported,
		isSupported,
		isTranslating,
		translate,
		translation,
	} = useTranslator({
		onLanguageSupportCheck: supported => {
			console.log('Language pair supported:', supported);
		},
		sourceLanguage: 'es',
		targetLanguage: 'en-US',
	});

	const [isMounted, setIsMounted] = useState<boolean>(false);
	const [text, setText] = useState<string>('Hola mundo!');

	useEffect(() => {
		setTimeout(() => {
			setIsMounted(true);
		}, 100);
	}, []);

	useEffect(() => {
		checkLanguageSupport().catch(() => {});
	}, [checkLanguageSupport]);

	const handleTranslate = async () => {
		await translate(text);
	};

	const handleChangeText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setText(event.target.value);
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
					The Translator API is not supported in this browser.
				</Layout.ContentNotSupported>
			</Layout>
		);
	}

	return (
		<Layout>
			{error && <Layout.Error>{error?.message}</Layout.Error>}
			<TextArea.Primary
				onChange={handleChangeText}
				placeholder='Enter text here...'
				value={text}
			/>
			<Button.Primary
				disabled={!isLanguagePairSupported || !isSupported || isTranslating}
				onClick={handleTranslate}
			>
				{isTranslating ? 'Translating...' : 'Translate'}
			</Button.Primary>
			<Layout.Paragraph>{translation}</Layout.Paragraph>
		</Layout>
	);
}
