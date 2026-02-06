'use client';

import { useResettableState } from '@vibehooks/react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Layout } from '@/layouts/Layout';

export default function Demo() {
	const [filters, setFilters, resetFilters] = useResettableState({
		category: 'all',
		query: '',
		sortBy: 'relevance',
	});

	const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFilters(prev => ({ ...prev, query: e.target.value }));
	};

	return (
		<Layout>
			<Layout.Title>Resettable State</Layout.Title>
			<div className='w-full max-w-sm flex flex-col items-center gap-2'>
				<Input.Primary
					onChange={handleQueryChange}
					placeholder='Search products...'
					type='text'
					value={filters.query}
				/>
				<div className='w-full flex flex-row items-center justify-center gap-2'>
					<Button.Primary onClick={() => console.log('Applying:', filters)}>
						Apply filters
					</Button.Primary>
					<Button.Destructive onClick={resetFilters}>
						Reset to default
					</Button.Destructive>
				</div>
			</div>

			<pre className='w-full flex flex-col text-white/60 items-center max-w-sm p-2 text-sm rounded font-reddit-sans'>
				{JSON.stringify(filters, null, 2)}
			</pre>
		</Layout>
	);
}
