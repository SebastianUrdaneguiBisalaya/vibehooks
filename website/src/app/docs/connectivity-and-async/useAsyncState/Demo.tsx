'use client';

import { useState } from 'react';

import { useAsyncState } from '../../../../../../src';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Tag } from '@/components/ui/Tag';
import { Layout } from '@/layouts/Layout';

export interface Post {
	id: number;
	title: string;
}

export default function Demo() {
	const [searchQuery, setSearchQuery] = useState<string>('');
	const { data, error, execute, isError, isLoading, reset, retry } =
		useAsyncState<Post[]>();

	const handleFetch = () => {
		execute('https://jsonplaceholder.typicode.com/posts', {
			params: {
				_limit: 5,
				q: searchQuery,
				retries: 2,
			},
		});
	};
	return (
		<Layout>
			<Layout.Title>Async State</Layout.Title>
			<div className='w-full flex max-md:items-center flex-col md:flex-row gap-4'>
				<Input.Primary
					onChange={e => setSearchQuery(e.target.value)}
					placeholder='Search posts...'
					value={searchQuery}
				/>
				<div className='flex flex-row items-center gap-2'>
					<Button.Primary disabled={isLoading} onClick={handleFetch}>
						{isLoading ? 'Loading...' : 'Search'}
					</Button.Primary>
					<Button.Warning onClick={reset}>Reset</Button.Warning>
				</div>
			</div>

			<div className='flex flex-col items-center gap-4'>
				{isError && (
					<div className='flex flex-col items-center gap-2'>
						<Layout.Error>
							<strong>Error:</strong> {error?.message}
						</Layout.Error>
						<Button.Secondary onClick={() => retry()}>
							Try again
						</Button.Secondary>
					</div>
				)}

				{isLoading && <Tag.Loading>Loading</Tag.Loading>}

				{data && (
					<ul className='divide-y divide-white/20 overflow-hidden'>
						{data.map(post => (
							<li
								className='px-4 py-2 bg-neutral-900 hover:bg-neutral-800 transition-colors duration-500 ease-in-out'
								key={post.id}
							>
								<h4 className='font-medium text-sm text-white/80 capitalize'>
									{post.title}
								</h4>
								<p className='text-xs text-white/50 font-reddit-sans'>
									ID: {post.id}
								</p>
							</li>
						))}
					</ul>
				)}

				<Layout.Caption>
					Click &quot;Fetch Posts&quot; to see results.
				</Layout.Caption>
			</div>
		</Layout>
	);
}
