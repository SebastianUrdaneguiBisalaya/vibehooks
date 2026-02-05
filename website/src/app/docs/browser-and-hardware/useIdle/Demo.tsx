'use client';

import { useIdle } from '../../../../../../src';
import { Tag } from '@/components/ui/Tag';
import { Layout } from '@/layouts/Layout';
import { cn } from '@/lib/cn';

export default function Demo() {
	const { isIdle, lastActiveAt } = useIdle({
		events: ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll'],
		timeout: 5000,
	});

	return (
		<Layout>
			<Layout.Title>Idle</Layout.Title>
			<div className='flex items-center gap-1.5'>
				<span className='relative flex h-2 w-2'>
					{!isIdle && (
						<span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75'></span>
					)}
					<span
						className={cn(
							'relative inline-flex rounded-full h-2 w-2',
							isIdle ? 'bg-amber-500' : 'bg-green-500'
						)}
					></span>
				</span>
				<Tag.Primary>
					Status: {isIdle ? 'User is Idle' : 'User is Active'}
				</Tag.Primary>
			</div>

			<Layout.Caption>
				Last Activity: {new Date(lastActiveAt).toLocaleTimeString()}
			</Layout.Caption>

			{isIdle && (
				<Layout.Caption className='text-amber-500'>
					Note: Auto-pausing background processes to save resources.
				</Layout.Caption>
			)}
		</Layout>
	);
}
