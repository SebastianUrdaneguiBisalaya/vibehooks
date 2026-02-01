'use client';

import { useState } from 'react';

import { useList } from "../../../../../../src";
import { Button } from "@/components/ui/Button";
import { Input } from '@/components/ui/Input';
import { Layout } from "@/layouts/Layout";

export interface ToDoItem {
  completed: boolean;
  title: string;
}

export default function Demo() {
  const { items, push, remove, update } = useList<ToDoItem>([]);
  const [task, setTask] = useState<string>('');

  return (
    <Layout>
      <Layout.Title>To-Do List</Layout.Title>
      <div className="flex flex-row items-center gap-2">
        <Input.Primary
          onChange={(event) => setTask(event.target.value)}
          placeholder="Add task"
          type="text"
          value={task}
        />
        <Button.Primary onClick={() => push({ completed: false, title: task })}>
          Add
        </Button.Primary>
      </div>
      <div className="w-full flex-1 flex flex-col items-center md:items-start gap-2">
        {
          items.length > 0 && items?.map((item, idx) => (
            <div
              className='w-full flex flex-col max-md:items-start md:flex-row items-center justify-between gap-2 px-4 py-2'
              key={idx}
            >
              <Layout.Caption className='text-left'>{item.title}</Layout.Caption>
              <div className='flex flex-row items-center gap-2'>
                <Button.Destructive onClick={() => remove(idx)}>
                  Remove
                </Button.Destructive>
                <Button.Secondary onClick={() => update(idx, { ...item, completed: false })}>
                  Done
                </Button.Secondary>
              </div>
            </div>
          ))
        }
      </div>
      <Layout.Caption>
        Additionally, <strong>useList</strong> returns an <strong>insert</strong> function that allows you to add items to the list at a specific index.
      </Layout.Caption>
    </Layout>
  )
}
