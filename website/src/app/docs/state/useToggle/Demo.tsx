'use client';

import { useToggle } from '../../../../../../src/index';
import { Tag } from "@/components/ui/Tag";
import { Layout } from "@/layouts/Layout";
import { cn } from '@/lib/cn';

export default function Demo() {
  const { handleToggle, status } = useToggle({ defaultValue: false });
  return (
    <Layout>
      <Layout.Title>Toggle</Layout.Title>
      <Tag.Primary>Status: {status.toString().charAt(0).toUpperCase() + status.toString().slice(1)}</Tag.Primary>
      <button
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent',
          'transition-colors duration-200 ease-in-out',
          status ? 'bg-black' : 'bg-white/20',
        )}
        onClick={handleToggle}
        type='button'
      >
        <span
          className={cn(
            'pointer-events-none inline-block h-5 w-5 transform rounded-full',
            'transition duration-200 ease-in-out',
            status ? 'translate-x-5' : 'translate-x-0',
            status ? 'bg-white' : 'bg-white/60',
          )}
        />
      </button>
    </Layout>
  )
}
