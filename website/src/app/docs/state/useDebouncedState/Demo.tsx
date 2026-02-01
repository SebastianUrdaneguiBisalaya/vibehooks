'use client';

import { useEffect } from "react";

import { useDebouncedState } from "../../../../../../src";
import { Input } from "@/components/ui/Input";
import { Tag } from "@/components/ui/Tag";
import { Layout } from "@/layouts/Layout";

export default function Demo() {
  const { debouncedValue, setValue, value } = useDebouncedState('', { delay: 500 });
  const isSearching = value !== debouncedValue && Boolean(value);

  useEffect(() => {
    if (!debouncedValue) return;
    const timer = setTimeout(() => {
      console.log(`Searching for: ${debouncedValue}`);
    }, 800);

    return () => clearTimeout(timer);
  }, [debouncedValue]);

  return (
    <Layout>
      <Layout.Title>Debounced State</Layout.Title>
      <Input.Primary
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type quickly..."
        value={value}
      />
      {isSearching && <Tag.Loading>Searching</Tag.Loading>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
        <div className="p-2 flex flex-col items-center gap-1.5 rounded-lg border border-white/20">
          <Layout.Caption>Immediate</Layout.Caption>
          <Layout.Caption>{value || '—'}</Layout.Caption>
        </div>
        <div className="p-2 flex flex-col items-center gap-1.5 rounded-lg border border-white/20">
          <Layout.Caption>Debounced</Layout.Caption>
          <Layout.Caption>{debouncedValue || '—'}</Layout.Caption>
        </div>
      </div>
      <Layout.Caption>The Debounced state only catches up 500ms after you stop typing.</Layout.Caption>
    </Layout>
  );
}
