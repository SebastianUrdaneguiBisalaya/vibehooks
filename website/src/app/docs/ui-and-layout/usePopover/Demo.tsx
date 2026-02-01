'use client';

import { usePopover } from "../../../../../../src";
import { Button } from "@/components/ui/Button";
import { Layout } from "@/layouts/Layout";

export default function Demo() {
  const { anchorRef, isOpen, popoverRef, toggle } = usePopover<HTMLButtonElement, HTMLDivElement>();
  return (
    <Layout>
      <Layout.Title>Popover</Layout.Title>
      <div className="relative flex flex-col items-center w-fit">
        <Button.Primary
          onClick={toggle}
          ref={anchorRef}
        >
          Actions
        </Button.Primary>
        {
          isOpen && (
            <div
              className="flex flex-row items-center gap-2 bg-neutral-900 absolute top-full mt-2 rounded-xl border border-white/20 px-3 py-2 shadow-xl"
              ref={popoverRef}
            >
              <Button.Secondary>
                Edit
              </Button.Secondary>
              <Button.Destructive>
                Delete
              </Button.Destructive>
            </div>
          )
        }
      </div>
    </Layout>
  )
}
