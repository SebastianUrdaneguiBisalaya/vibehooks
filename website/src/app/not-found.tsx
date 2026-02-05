'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import Footer from '@/components/shared/Footer';
import Navbar from '@/components/shared/Navbar';

export default function NotFound() {
	return (
		<div className='w-full max-w-3xl grow flex flex-col items-center py-4 md:py-6 px-8'>
			<Navbar />
			<main className='flex flex-col gap-8 items-center justify-center p-8 grow w-full h-full'>
				<h3 className='font-sora text-4xl md:text-5xl font-bold text-white'>
					404
				</h3>
				<p className='font-reddit-sans text-white/70'>
					I am sorry, but the page you are looking for does not exist.
				</p>
				<Link
					className='flex flex-row items-center gap-2 group hover:scale-[1.05] transition-all duration-500 ease-in-out border border-white/20 px-4 py-3 rounded-xl'
					href='/'
				>
					<ArrowLeft className='w-4 h-4 text-white/70 group-hover:text-white transition-colors duration-500 ease-in-out' />
					<span className='text-white/70 font-reddit-sans group-hover:text-white transition-colors duration-500 ease-in-out'>
						Go back to the <span className='font-reddit-sans'>home</span>
					</span>
				</Link>
			</main>
			<Footer />
		</div>
	);
}
