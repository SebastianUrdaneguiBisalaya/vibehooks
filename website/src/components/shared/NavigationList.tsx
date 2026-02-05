'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { hooksList } from '@/constants/constants';
import { cn } from '@/lib/cn';

export interface HookProps {
	name: string;
	path: string;
}

export interface HooksListProps {
	hooks: HookProps[];
	title: string;
}

export default function NavigationList({
	toggleMobile,
}: {
	toggleMobile?: () => void;
}) {
	const pathname = usePathname();

	const listMajorItems = hooksList.map(item => ({
		show: false,
		title: item.title,
	}));

	const [listMajorItemsState, setListMajorItemsState] = useState<
		Record<string, boolean>
	>(
		listMajorItems.reduce((acc, item) => ({ ...acc, [item.title]: false }), {})
	);

	const toggleMajorItem = (title: string) => {
		setListMajorItemsState(prev => ({ ...prev, [title]: !prev[title] }));
	};

	return (
		<div
			className={cn(
				'grid grid-rows-[1fr] opacity-100 transition-[grid-template-rows,opacity] duration-500 ease-out overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'
			)}
		>
			<div className='min-h-0 flex flex-col items-start'>
				<div className='flex flex-col items-start gap-5 px-6 py-4'>
					{hooksList.map(item => (
						<div
							className='w-full flex flex-col items-start gap-2'
							key={item.title}
						>
							<button
								aria-label={`Open ${item.title} hooks list`}
								className='w-full flex flex-row items-center justify-between gap-2 cursor-pointer group'
								id={`open-${item.title}-hooks-list`}
								onClick={() => toggleMajorItem(item.title)}
							>
								<span className='font-reddit-sans text-sm font-semibold text-white/95 group-hover:text-white'>
									{item.title}
								</span>
								<ChevronRight
									className={cn(
										'w-4.5 text-white/50 transition-all duration-500 ease-out group-hover:text-white',
										listMajorItemsState[item.title] && 'rotate-90'
									)}
								/>
							</button>
							<div
								className={cn(
									'w-full grid transition-[grid-template-rows,opacity] duration-400 ease-out overflow-hidden',
									listMajorItemsState[item.title]
										? 'grid-rows-[1fr] opacity-100'
										: 'grid-rows-[0fr] opacity-0'
								)}
							>
								<div className='w-full flex flex-col items-start min-h-0'>
									{item.hooks.map(hook => (
										<Link
											className={cn(
												'font-sora text-xs text-white/60 hover:text-white transition-all duration-500 ease-in-out cursor-pointer px-2 py-2 border-l border-l-white/20 w-full',
												pathname === hook.path &&
													'font-semibold text-white/90 border-l-white/90'
											)}
											href={hook.path}
											key={hook.name}
											onNavigate={toggleMobile}
										>
											{hook.name}
										</Link>
									))}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
