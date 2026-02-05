'use client';

import { useState, useEffect } from 'react';

import { usePictureInPicture } from '../../../../../../src';
import { Button } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';
import { Layout } from '@/layouts/Layout';

export default function Demo() {
	const [isMounted, setIsMounted] = useState<boolean>(false);
	const { enter, exit, isActive, isSupported, videoRef } =
		usePictureInPicture();

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
					The Picture-in-Picture API is not supported in this browser.
				</Layout.ContentNotSupported>
			</Layout>
		);
	}

	return (
		<Layout>
			<Layout.Title>Picture-in-Picture</Layout.Title>
			<Tag.Primary>Status: {isActive ? 'Active' : 'Inactive'}</Tag.Primary>
			<div className='flex flex-col items-center gap-2'>
				<video
					className='aspect-video rounded-md w-full'
					controls
					ref={videoRef}
					src='/video.mp4'
				/>
				<div className='flex flex-row items-center gap-2'>
					<Button.Primary disabled={!isSupported || isActive} onClick={enter}>
						Enter PiP
					</Button.Primary>
					<Button.Secondary disabled={!isActive} onClick={exit}>
						Exit PiP
					</Button.Secondary>
				</div>
			</div>
		</Layout>
	);
}
