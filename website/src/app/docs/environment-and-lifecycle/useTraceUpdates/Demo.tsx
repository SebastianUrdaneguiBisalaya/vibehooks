'use client';

import { useTraceUpdates } from '@vibehooks/react';
import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Layout } from '@/layouts/Layout';

export default function Demo() {
	const [count, setCount] = useState<number>(0);
	const [text, setText] = useState<string>('');

	const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
		setText(e.target.value);
	};

	const handleClick = () => {
		setCount(prevCount => prevCount + 1);
	};

	useTraceUpdates(
		{
			count,
			text,
		},
		'TraceDemoComponent'
	);

	return (
		<Layout>
			<Layout.Title>Trace Updates</Layout.Title>
			<Button.Primary onClick={() => handleClick()}>
				Change count
			</Button.Primary>
			<Input.Primary
				onChange={handleChangeText}
				placeholder='Type to trigger trace...'
				type='text'
				value={text}
			/>
		</Layout>
	);
}
