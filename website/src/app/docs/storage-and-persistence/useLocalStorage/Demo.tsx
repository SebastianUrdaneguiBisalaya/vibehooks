'use client';

import { useLocalStorage } from '@vibehooks/react';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';
import { Layout } from '@/layouts/Layout';
import { cn } from '@/lib/cn';

export interface Preferences {
	compactMode: boolean;
}

export default function Demo() {
	const [isMounted, setIsMounted] = useState<boolean>(false);
	const storage = useLocalStorage<Preferences>('preferences', {
		fallback: {
			compactMode: false,
		},
	});

	const prefs = storage.value;

	const handleToggle = () => {
		storage.update(prev => ({
			...prev,
			compactMode: !prev!.compactMode,
		}));
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

	if (!prefs) return null;

	return (
		<Layout>
			<Layout.Title>Local Storage</Layout.Title>
			<div className='w-full flex flex-row items-center gap-4 justify-center'>
				<Tag.Primary>Compact Mode</Tag.Primary>
				<Button.Secondary className='rounded-full' onClick={handleToggle}>
					<div
						className={cn(
							'h-5 w-5 bg-white-100 rounded-full transition-transform duration-500 ease-in-out',
							prefs.compactMode ? 'translate-x-3' : '-translate-x-3'
						)}
					/>
				</Button.Secondary>
			</div>
		</Layout>
	);
}
