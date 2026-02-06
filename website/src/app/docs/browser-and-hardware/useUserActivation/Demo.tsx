'use client';

import { useUserActivation } from '@vibehooks/react';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';
import { Layout } from '@/layouts/Layout';

export default function UserActivationDemo() {
	const { hasBeenActive, isActive, isSupported, refresh } = useUserActivation();

	const [isMounted, setIsMounted] = useState<boolean>(false);

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
					The User Activation API is not supported in this browser.
				</Layout.ContentNotSupported>
			</Layout>
		);
	}

	return (
		<Layout>
			<Layout.Title>User Activation</Layout.Title>
			<Layout.Caption>
				Monitors the user&apos;s activation status in the browser.
			</Layout.Caption>
			<div className='w-full flex flex-col md:flex-row items-center justify-center gap-4'>
				<div className='flex flex-row items-center justify-center gap-2 w-full border border-white/20 rounded-lg p-2'>
					<Layout.Caption className='text-left'>
						Did the user ever interact?
					</Layout.Caption>
					<Tag.Primary className='text-right'>
						{hasBeenActive ? 'true' : 'false'}
					</Tag.Primary>
				</div>
				<div className='flex flex-row items-center justify-center gap-2 w-full border border-white/20 rounded-lg p-2'>
					<Layout.Caption className='text-left'>
						Current transient activation
					</Layout.Caption>
					<Tag.Primary className='text-right'>
						{isActive ? 'true' : 'false'}
					</Tag.Primary>
				</div>
			</div>

			<div className='flex flex-col md:flex-row items-center gap-2'>
				<Button.Primary onClick={refresh}>Status refresh</Button.Primary>
				<Button.Secondary
					disabled={!isActive}
					onClick={() => alert('Sensitive action executed.')}
				>
					Sensitive Action
				</Button.Secondary>
			</div>

			{!hasBeenActive && (
				<Layout.Caption>
					Interact with the page (click, keyboard, touch) to activate the state.
				</Layout.Caption>
			)}

			{hasBeenActive && !isActive && (
				<Layout.Caption>
					The temporary activation is fleeting. Try clicking and performing the
					action immediately.
				</Layout.Caption>
			)}
		</Layout>
	);
}
