'use client';

import { useState } from 'react';

import { usePreviousDistinct } from '../../../../../../src/index';
import { Layout } from '@/layouts/Layout';

const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b'];

export default function Demo() {
	const [color, setColor] = useState('#3b82f6');
	const prevColor = usePreviousDistinct(color);

	return (
		<Layout>
			<Layout.Title>Previous Distinct</Layout.Title>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
				<div className='flex flex-col gap-2'>
					<Layout.Caption>Current</Layout.Caption>
					<div
						className='h-12 w-full rounded-md'
						style={{ backgroundColor: color }}
					/>
					<Layout.Caption>{color}</Layout.Caption>
				</div>

				<div className='flex flex-col gap-2'>
					<Layout.Caption>Previous (Distinct)</Layout.Caption>
					<div
						className='h-12 w-full rounded-md bg-slate-100'
						style={{ backgroundColor: prevColor }}
					/>
					<Layout.Caption>{prevColor ?? '—'}</Layout.Caption>
				</div>
			</div>
			<div className='w-full grid grid-cols-4 gap-2'>
				{colors.map(c => (
					<button
						className='h-8 rounded-md transition-transform active:scale-95 cursor-pointer'
						key={c}
						onClick={() => setColor(c)}
						style={{ backgroundColor: c }}
						title={`Set to ${c}`}
					/>
				))}
			</div>
			<div className='flex flex-col items-center gap-1.5'>
				<Layout.Caption>
					Clicking a different color updates both.
				</Layout.Caption>
				<Layout.Caption>
					Clicking the <b>same color twice</b> will not change the Previous
					value.
				</Layout.Caption>
			</div>
		</Layout>
	);
}
