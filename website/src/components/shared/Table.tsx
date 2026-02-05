import type { ReactElement } from 'react';

import { toUpperCaseFirstLetter } from '@/lib/functions';

export interface TableItemProps {
	description: string;
	name: string;
	type: string;
}

export interface BaseTableProps {
	data: TableItemProps[];
}

export interface TableCompound {
	(): ReactElement | null;
	Parameters: () => ReactElement;
	ReturnValues: () => ReactElement;
}

export default function BaseTable({ data }: BaseTableProps) {
	const columns =
		data.length > 0 ? (Object.keys(data[0]) as (keyof TableItemProps)[]) : [];
	return (
		<div className='w-full overflow-hidden'>
			<div className='overflow-x-auto'>
				<table className='w-full table-auto'>
					<colgroup>
						<col className='min-w-20' />
						<col className='min-w-20' />
						<col className='min-w-72' />
					</colgroup>
					<thead className='bg-white/5'>
						<tr>
							{columns.map(column => (
								<th
									className='font-sora text-left px-2 py-2 text-sm'
									key={column}
								>
									{toUpperCaseFirstLetter(column)}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{data.map((row, idx) => (
							<tr
								className='border-b border-white/20 even:bg-white/4 transition-all duration-500 ease-in-out'
								key={idx}
							>
								{columns.map(column => (
									<td className='font-reddit-sans px-2 py-2' key={column}>
										{String(row[column])}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
