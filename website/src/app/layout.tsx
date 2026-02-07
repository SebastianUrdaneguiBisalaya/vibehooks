import type { Metadata } from 'next';
import { Sora, Reddit_Sans, Jersey_15, Cascadia_Code } from 'next/font/google';

import './globals.css';

const sora = Sora({
	subsets: ['latin'],
	variable: '--font-sora',
});

const redditSans = Reddit_Sans({
	subsets: ['latin'],
	variable: '--font-reddit-sans',
});

const jersey15 = Jersey_15({
	subsets: ['latin'],
	variable: '--font-jersey-15',
	weight: ['400'],
});

const cascadiaCode = Cascadia_Code({
	subsets: ['latin'],
	variable: '--font-cascadia-code',
	weight: ['500'],
});

export const metadata: Metadata = {
	authors: [
		{
			name: 'Sebastian Marat Urdanegui Bisalaya',
			url: 'https://sebastianurdanegui.com',
		},
	],
	description:
		'Modern and unopinionated React hooks with a focus on developer experience.',
	keywords: [
		'react hook library',
		'typescript hooks',
		'unopinionated react hooks',
		'type-safe react state management',
		'custom hooks for typescript',
		'open-source',
		'use hooks',
		'vibehooks',
		'react',
		'typescript',
	],
	title: 'vibeHooks - Modern and unopinionated React hooks.',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<meta content='PE' name='geo.region' />
			<meta content='Perú' name='geo.placename' />
			<meta content='general' name='rating' />
			<meta content='global' name='distribution' />
			<meta
				content='vibeHooks - Modern and unopinionated React hooks.'
				property='og:title'
			/>
			<meta
				content='Modern and unopinionated React hooks with a focus on developer experience.'
				property='og:description'
			/>
			<meta
				content='vibeHooks - Modern and unopinionated React hooks.'
				name='twitter:title'
			/>
			<meta
				content='Modern and unopinionated React hooks with a focus on developer experience.'
				name='twitter:description'
			/>
			<meta
				content='https://vibehooks.sebastianurdanegui.com'
				property='og:url'
			/>
			<meta
				content='https://vibehooks.sebastianurdanegui.com'
				property='twitter:url'
			/>
			<meta content='website' name='og:type' />
			<meta content='summary_large_image' name='twitter:card' />
			<body
				className={`${sora.variable} ${redditSans.variable} ${jersey15.variable} ${cascadiaCode.variable} antialiased`}
			>
				<div className='w-full min-h-screen mx-auto h-full flex flex-col items-center overflow-x-hidden'>
					{children}
				</div>
			</body>
		</html>
	);
}
