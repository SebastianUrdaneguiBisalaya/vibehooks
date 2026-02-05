'use client';

import { motion, useAnimationControls } from 'motion/react';
import Link from 'next/link';
import { useEffect } from 'react';

import { hooksList } from '@/constants/constants';

export interface SliderItemProps {
	path: string;
	title: string;
}

const startLeft = (controls: ReturnType<typeof useAnimationControls>) => {
	controls.start({
		transition: {
			duration: 60,
			ease: 'linear',
			repeat: Infinity,
		},
		x: '-100%',
	});
};

const startRight = (controls: ReturnType<typeof useAnimationControls>) => {
	controls.start({
		transition: {
			duration: 60,
			ease: 'linear',
			repeat: Infinity,
		},
		x: 0,
	});
};

export default function Slider() {
	const hooksTag: SliderItemProps[] = hooksList.flatMap(item =>
		item.hooks.map(hook => ({
			path: hook.path,
			title: hook.name,
		}))
	);

	const middle = Math.ceil(hooksTag.length / 2);
	const firstChunk = hooksTag.slice(0, middle);
	const secondChunk = hooksTag.slice(middle);

	const row1Controls = useAnimationControls();
	const row2Controls = useAnimationControls();

	useEffect(() => {
		startLeft(row1Controls);
		startRight(row2Controls);
	}, [row1Controls, row2Controls]);

	return (
		<div className='flex flex-col gap-3 overflow-hidden w-full'>
			<div
				className='flex motion-slider-gradient'
				onMouseEnter={() => row1Controls.stop()}
				onMouseLeave={() => startLeft(row1Controls)}
			>
				<motion.div
					animate={row1Controls}
					className='flex flex-row items-center'
					initial={{ x: 0 }}
				>
					{firstChunk.map(item => (
						<SliderItem key={item.title} path={item.path} title={item.title} />
					))}
				</motion.div>
				<motion.div
					animate={row1Controls}
					className='flex flex-row items-center'
					initial={{ x: 0 }}
				>
					{firstChunk.map(item => (
						<SliderItem key={item.title} path={item.path} title={item.title} />
					))}
				</motion.div>
			</div>
			<div
				className='flex motion-slider-gradient'
				onMouseEnter={() => row2Controls.stop()}
				onMouseLeave={() => startRight(row2Controls)}
			>
				<motion.div
					animate={row2Controls}
					className='flex flex-row items-center'
					initial={{ x: '-100%' }}
				>
					{secondChunk.map(item => (
						<SliderItem key={item.title} path={item.path} title={item.title} />
					))}
				</motion.div>
				<motion.div
					animate={row2Controls}
					className='flex flex-row items-center'
					initial={{ x: '-100%' }}
				>
					{secondChunk.map(item => (
						<SliderItem key={item.title} path={item.path} title={item.title} />
					))}
				</motion.div>
			</div>
		</div>
	);
}

function SliderItem({ path, title }: SliderItemProps) {
	return (
		<Link
			className='group shrink-0 border-t border-x border-b-3 border-t-white/20 border-x-white/20 border-b-white/40 mr-2 px-2 py-1 rounded-xl bg-[rgba(255,255,255,0.06)] hover:bg-white transition-all duration-500 ease-in-out'
			href={path}
		>
			<span className='shrink-0 text-white/70 group-hover:text-black transition-all duration-500 ease-in-out text-sm'>
				{title}
			</span>
		</Link>
	);
}
