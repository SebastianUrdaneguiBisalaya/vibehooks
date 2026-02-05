'use client';

import { useState, useEffect, useCallback } from 'react';

import { useIndexedDB } from '../../../../../../src';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Layout } from '@/layouts/Layout';

export interface Note {
	createdAt: number;
	id?: number;
	text: string;
}

export default function Demo() {
	const db = useIndexedDB({
		name: 'notes-db',
		onUpgrade(db) {
			if (!db.objectStoreNames.contains('notes')) {
				db.createObjectStore('notes', {
					autoIncrement: true,
					keyPath: 'id',
				});
			}
		},
		version: 1,
	});

	const [notes, setNotes] = useState<Note[]>([]);
	const [text, setText] = useState<string>('');

	const loadNotes = useCallback(async () => {
		const result = await db.withStore('notes', store => {
			return new Promise<Note[]>(resolve => {
				const request = store.getAll();
				request.onsuccess = () => {
					resolve(request.result);
				};
			});
		});
		setNotes(result.reverse());
	}, [db]);

	const addNote = async () => {
		if (!text.trim()) return;
		await db.withStore('notes', store => {
			store.add({ createdAt: Date.now(), text });
			return Promise.resolve();
		});
		setText('');
		loadNotes();
	};

	useEffect(() => {
		setTimeout(() => {
			loadNotes();
		}, 100);
	}, [loadNotes]);

	const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setText(event.target.value);
	};

	return (
		<Layout>
			<Layout.Title>IndexedDB</Layout.Title>
			<div className='w-full flex flex-row items-center justify-center gap-2'>
				<Input.Primary
					onChange={handleOnChange}
					placeholder='Write something here'
					value={text}
				/>
				<Button.Primary onClick={addNote}>Save</Button.Primary>
			</div>
			<div className='flex flex-col items-center gap-2'>
				{notes.map(note => (
					<Layout.Caption key={note.id}>{note.text}</Layout.Caption>
				))}
			</div>
		</Layout>
	);
}
