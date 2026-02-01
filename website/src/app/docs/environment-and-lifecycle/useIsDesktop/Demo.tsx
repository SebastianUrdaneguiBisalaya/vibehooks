'use client';

import { useIsDesktop } from "../../../../../../src";
import { Tag } from "@/components/ui/Tag";
import { Layout } from "@/layouts/Layout";

export default function Demo() {
  const isDesktop = useIsDesktop(1024);
	return (
		<Layout>
      <Layout.Title>Verifying Desktop View</Layout.Title>
      <div className="flex flex-col items-center gap-1.5">
        <Layout.Caption>Current environment</Layout.Caption>
        <Tag.Primary>{isDesktop ? "🖥️ Desktop View" : "📱 Mobile/Tablet View"}</Tag.Primary>
      </div>
		</Layout>
	);
}
