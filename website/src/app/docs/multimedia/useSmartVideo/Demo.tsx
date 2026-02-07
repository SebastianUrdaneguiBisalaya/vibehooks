'use client';

import { useSmartVideo } from '@vibehooks/react';

import { Button } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';
import { Layout } from '@/layouts/Layout';

export default function Demo() {
	const { isPlaying, isVisible, pause, play, reset, stop, videoRef } =
		useSmartVideo({
			autoPlay: true,
			pauseOnExit: true,
			resetOnExit: true,
			threshold: 0.5,
		});

	return (
		<Layout>
			<Layout.Title>Smart Video</Layout.Title>
			<Tag.Primary>Status: {isPlaying ? 'Playing' : 'Paused'}</Tag.Primary>
			<video
				className='aspect-video rounded-md w-full'
				controls
				ref={videoRef}
				src='https://res.cloudinary.com/drzumfcdp/video/upload/v1770480406/projects/video_acllim.mp4'
			/>
			<Tag.Primary>
				Visibility: {isVisible ? 'Visible' : 'Not visible'}
			</Tag.Primary>
			<div className='flex flex-row items-center justify-center gap-2'>
				<Button.Secondary onClick={play}>Play</Button.Secondary>
				<Button.Secondary onClick={pause}>Pause</Button.Secondary>
				<Button.Secondary onClick={stop}>Stop</Button.Secondary>
				<Button.Secondary onClick={reset}>Reset</Button.Secondary>
			</div>
		</Layout>
	);
}
