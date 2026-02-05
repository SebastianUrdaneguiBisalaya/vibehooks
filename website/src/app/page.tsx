'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import BlurIn from '@/animations/BlurIn';
import StaggeredFade from '@/animations/StaggeredFade';
import Slider from '@/components/landing/Slider';
import CodeBlock from '@/components/shared/Codeblock';
import { cn } from '@/lib/cn';

export default function Page() {
	return (
		<main className='max-w-3xl w-full grow h-full p-6 md:p-8 flex flex-col items-center justify-start gap-8'>
			<div className='absolute inset-0 bg-noise' />
			<div className='flex flex-col items-end absolute -right-60 -top-10 blur-xl z-0 '>
				<div className='h-40 rounded-full w-120 md:w-240 z-1 bg-linear-to-b blur-[6rem] from-green-600 to-sky-600'></div>
				<div className='h-40 rounded-full w-160 md:w-360 z-1 bg-linear-to-b blur-[6rem] from-pink-900 to-yellow-400'></div>
				<div className='h-40 rounded-full w-120 md:w-240 z-1 bg-linear-to-b blur-[6rem] from-yellow-600 to-sky-500'></div>
			</div>
			<div className='flex flex-col items-center justify-center grow w-full h-full gap-10'>
				<div className='flex flex-col items-center'>
					<BlurIn>
						<Link
							className='group flex flex-row items-center gap-3 cursor-pointer text-white/90 hover:text-white hover:scale-[1.05] transition-all duration-500 ease-in-out border border-white/20 px-3 py-1.5 rounded-2xl mb-4'
							href='https://github.com/SebastianUrdaneguiBisalaya/vibehooks'
							target='_blank'
						>
							<svg fill='' height='20' viewBox='0 0 1024 1024' width='20'>
								<path
									clipRule='evenodd'
									d='M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z'
									fill='currentColor'
									fillRule='evenodd'
									transform='scale(64)'
								/>
							</svg>
							<div className='flex flex-row items-center gap-1'>
								<svg
									className='star-icon relative'
									height='16'
									viewBox='0 0 24 24'
									width='16'
									xmlns='http://www.w3.org/2000/svg'
								>
									<title>Star</title>
									<defs>
										<linearGradient
											id='starGradient'
											x1='0%'
											x2='100%'
											y1='0%'
											y2='100%'
										>
											<stop
												offset='0%'
												stopColor='rgba(251, 191, 36, 0.8)'
											></stop>
											<stop
												offset='50%'
												stopColor='rgba(251, 191, 36, 1)'
											></stop>
											<stop
												offset='100%'
												stopColor='rgba(251, 191, 36, 0.8)'
											></stop>
										</linearGradient>
									</defs>
									<polygon
										fill='url(#starGradient)'
										points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2'
									></polygon>
								</svg>
								<span className='font-sora text-sm text-white/90 pt-0.5 group-hover:text-white transition-all duration-500 ease-in-out'>
									1
								</span>
							</div>
						</Link>
					</BlurIn>
					<BlurIn>
						<span className='font-jersey-15 text-white/80 text-7xl md:text-8xl lg:text-9xl'>
							vibe
						</span>
						<span className='font-jersey-15 text-white text-7xl md:text-8xl lg:text-9xl'>
							Hooks
						</span>
					</BlurIn>
					<StaggeredFade text='Modern React and Next.js hooks, unopinionated and focused on developer experience.' />
				</div>
				<BlurIn className='flex flex-col items-center gap-3'>
					<CodeBlock
						classNameCode='bg-transparent'
						code='npm install @vibehooks/react'
						language='bash'
					/>
					<p className='text-white/50 font-sora text-xs self-center text-center'>
						Modern, TypeScript-first hooks for{' '}
						<strong className='text-white'>React</strong> and{' '}
						<strong className='text-white'>Next.js</strong>, fully documented
						with JSDoc.
					</p>
				</BlurIn>
				<BlurIn className='w-full'>
					<Slider />
				</BlurIn>
				<BlurIn>
					<Link
						className='relative group bg-white flex flex-row items-center font-sora text-sm text-neutral-900 overflow-hidden md:hover:text-white cursor-pointer transition-all duration-500 ease-in-out border border-white/40 hover:border-white px-4 py-3 rounded-xl'
						href='/docs/ai/useSpeech'
					>
						<span className='z-20'>Get Started</span>
						<ArrowRight className='z-20 w-4 h-4 ml-2 text-background md:group-hover:text-white/80 transition-all duration-500 ease-in-out group-hover:translate-x-0.5' />
						<span className='pointer-events-none absolute inset-0 z-0 max-md:hidden' />
						<span
							className={cn(
								'max-md:hidden',
								'pointer-events-none absolute inset-0 z-0 block h-full w-full bg-background',
								'opacity-0 transition-opacity',
								'group-focus-visible:opacity-100 group-active:opacity-100',
								'origin-left lg:scale-x-0 lg:opacity-100 lg:transition-transform',
								'lg:group-hover:origin-left lg:group-hover:scale-x-100',
								'lg:group-focus-visible:origin-left lg:group-focus-visible:scale-x-100',
								'lg:group-active:origin-left lg:group-active:scale-x-100',
								'motion-safe:transition-transform motion-safe:ease-in-out',
								'lg:motion-safe:duration-500 lg:motion-reduce:duration-0'
							)}
						/>
					</Link>
				</BlurIn>
				<BlurIn>
					<span className='font-reddit-sans text-xs text-white/60'>
						Developed by{' '}
						<a
							className='font-bold hover:text-white/80 transition-colors duration-500 ease-in-out underline cursor-pointer'
							href='http://sebastianurdanegui.com'
							rel='noopener noreferrer'
							target='_blank'
						>
							Sebastian Marat Urdanegui Bisalaya
						</a>
					</span>
				</BlurIn>
			</div>
		</main>
	);
}
