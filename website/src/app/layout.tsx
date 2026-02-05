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
	description:
		'Modern and unopinionated React hooks with a focus on developer experience.',
	title: 'vibeHooks - Modern and unopinionated React hooks.',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body
				className={`${sora.variable} ${redditSans.variable} ${jersey15.variable} ${cascadiaCode.variable} antialiased`}
			>
				<div className='w-full min-h-screen mx-auto h-full flex flex-col items-center'>
					{children}
				</div>
			</body>
		</html>
	);
}
