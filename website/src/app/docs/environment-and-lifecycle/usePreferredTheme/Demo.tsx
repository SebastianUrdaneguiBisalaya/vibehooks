'use client';

import { usePreferredTheme } from "../../../../../../src";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { Layout } from "@/layouts/Layout";

export default function Demo() {
  const { setUserTheme, systemTheme, toggleTheme, userTheme } = usePreferredTheme();
	return (
		<Layout className='transition-colors duration-500 ease-in-out dark:bg-neutral-900 bg-neutral-100'>
      <Layout.Title className="transition-colors duration-500 ease-in-out dark:text-white/80 text-neutral-900">Theme Manager</Layout.Title>
      <div className="flex flex-row items-center justify-center gap-2">
        <Tag.Primary className="not-dark:bg-white-100 not-dark:text-neutral-900">System: {systemTheme}</Tag.Primary>
        <Tag.Primary className="not-dark:bg-white-100 not-dark:text-neutral-900">User: {userTheme ?? "Follow system"}</Tag.Primary>
      </div>
      <div className="flex flex-row justify-center items-center gap-2">
        <Button.Primary onClick={() => toggleTheme()}>Toggle</Button.Primary>
        <Button.Destructive className="not-dark:bg-red-200 not-dark:text-red-500" onClick={() => setUserTheme(null)}>Reset</Button.Destructive>
      </div>
		</Layout>
	);
}
