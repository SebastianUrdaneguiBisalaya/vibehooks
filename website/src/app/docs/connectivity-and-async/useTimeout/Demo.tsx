'use client';

import { useState } from "react";

import { useTimeout } from "../../../../../../src";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { Layout } from "@/layouts/Layout";

export default function Demo() {
  const [isVisible, setIsVisible] = useState(false);

  const { cancel, isActive, reset, start } = useTimeout(
    () => {
      setIsVisible(false);
    },
    { delay: 3000, startOnMount: false }
  );

  const triggerNotification = () => {
    setIsVisible(true);
    start();
  };

  return (
    <Layout>
      <Layout.Title>Timeout</Layout.Title>
      <div className="flex items-center justify-center">
        {isVisible ? (
          <Layout.Caption>Success! Task saved.</Layout.Caption>
        ) : (
          <Layout.Caption>No changes detected.</Layout.Caption>
        )}
      </div>
      <div className="flex flex-row items-center justify-center gap-2">
        <Button.Primary disabled={isActive} onClick={triggerNotification}>
          {isActive ? 'Processing...' : 'Save Changes'}
        </Button.Primary>
        <Button.Warning onClick={reset}>
          Reset
        </Button.Warning>
        <Button.Destructive onClick={cancel}>
          Cancel
        </Button.Destructive>
      </div>
      {isActive && <Tag.Loading>Auto-hiding in 3 seconds</Tag.Loading>}
    </Layout>
  )
}
