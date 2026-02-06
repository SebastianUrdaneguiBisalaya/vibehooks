'use client';

import { useTaskQueue, type Task } from '@vibehooks/react/useTaskQueue';
import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';
import { Layout } from '@/layouts/Layout';

export default function Demo() {
	const { enqueue, queue, running } = useTaskQueue<string>();
	const [completed, setCompleted] = useState<string[]>([]);

	const addNewTask = () => {
		const taskId = `task-${Math.floor(Math.random() * 1000)}`;

		const task: Task<string> = {
			id: taskId,
			run: async () => {
				await new Promise(resolve => setTimeout(resolve, 2000));
				setCompleted(prev => [...prev, taskId]);
				return taskId;
			},
		};

		enqueue(task);
	};
	return (
		<Layout>
			<Layout.Title>Task Queue</Layout.Title>
			{running && <Tag.Loading>Processing queue</Tag.Loading>}
			{!running && <Tag.Primary>System idle</Tag.Primary>}
			<Button.Primary onClick={addNewTask}>Add task</Button.Primary>
			<Layout.Paragraph>Pending Queue ({queue.length})</Layout.Paragraph>
			<div className='flex flex-col items-center gap-2'>
				{queue.length === 0 && (
					<Layout.Caption>No tasks to process.</Layout.Caption>
				)}
				{queue.map((task, index) => (
					<div
						className='flex gap-2 justify-between items-center px-2 py-1 bg-neutral-700 rounded-md'
						key={task.id}
					>
						<Layout.Caption>{task.id}</Layout.Caption>
						{index === 0 && running && <Tag.Primary>Active</Tag.Primary>}
					</div>
				))}
			</div>
			<div className='w-full flex flex-col items-center gap-2'>
				<Layout.Paragraph>
					Completed Tasks ({completed.length})
				</Layout.Paragraph>
				<div className='flex items-center flex-wrap gap-2 w-full'>
					{completed.map(id => (
						<Layout.Caption key={id}>{id} ✓</Layout.Caption>
					))}
				</div>
			</div>
		</Layout>
	);
}
