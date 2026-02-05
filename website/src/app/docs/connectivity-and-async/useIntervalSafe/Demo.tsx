'use client';

import { useState } from 'react';

import { useIntervalSafe } from '../../../../../../src';
import { Button } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';
import { Layout } from '@/layouts/Layout';

export default function Demo() {
	const [logs, setLogs] = useState<string[]>([]);
	const { cancel, executionCount, isActive, reset, start } = useIntervalSafe(
		() => {
			const timestamp = new Date().toLocaleTimeString();
			setLogs(prev => [`Tick a ${timestamp}`, ...prev].slice(0, 6));
		},
		{
			delay: 2000,
			maxExecutions: 6,
			startOnMount: false,
		}
	);

	const handleReset = () => {
		reset();
		setLogs([]);
	};

	return (
		<Layout>
			<Layout.Title>Interval Safe</Layout.Title>
			<Tag.Primary>
				<strong>Status:</strong> {isActive ? 'Running' : 'Idle'}
			</Tag.Primary>
			<div className='rounded-md p-2 border border-white/20 max-w-48 w-full'>
				<div className='flex flex-row justify-between gap-2 mb-2'>
					<Layout.Caption className='text-left'>Execution:</Layout.Caption>
					<Layout.Caption className='text-right'>
						{executionCount}/6
					</Layout.Caption>
				</div>
				<div className='w-full bg-neutral-600 h-2 rounded-full overflow-hidden'>
					<div
						className='bg-neutral-800 h-full transition-all duration-500'
						style={{ width: `${(executionCount / 6) * 100}%` }}
					/>
				</div>
			</div>

			<div className='grid grid-cols-3 gap-x-2 gap-y-3 place-items-center'>
				{logs.map((log, i) => (
					<div className='border border-white/20 px-2 py-1 rounded-xl' key={i}>
						<Layout.Caption>{log}</Layout.Caption>
					</div>
				))}
			</div>

			<div className='flex flex-row items-center gap-2'>
				<Button.Primary onClick={isActive ? cancel : start}>
					{isActive ? 'Pause' : 'Start'}
				</Button.Primary>
				<Button.Warning onClick={handleReset}>Reset</Button.Warning>
			</div>

			<Layout.Caption>
				This interval is configured to stop automatically after 6 ticks.
			</Layout.Caption>
		</Layout>
	);
}
