'use client';

import { useState } from 'react';

import { useCountDown } from '../../../../../../src/index';
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { Layout } from "@/layouts/Layout";

export default function Demo() {
  const [endTime] = useState(() => Date.now() + 10_000);

  const {
    controls: { increment, pause, reset, resume, start },
    count,
    status
  } = useCountDown({
    endTime: endTime,
    options: {
      interval: 100,
      onComplete: () => {
        console.log("Countdown finished!");
      },
      onTick: (remaining) => {
        if (remaining < 10000) console.log("Final stretch!");
      }
    },
    startOnMount: false
  });

  const formatTime = (ms: number) => (ms / 1000).toFixed(0);

  return (
      <Layout>
        <Layout.Title>Countdown</Layout.Title>
        <Tag.Primary>Status: {status.charAt(0).toUpperCase() + status.slice(1)}</Tag.Primary>
        <Tag.Primary>Remaining: {formatTime(count ?? 0)}s</Tag.Primary>
        <div className="flex flex-row items-center justify-center gap-2">
          <Button.Primary onClick={() => start()}>Start</Button.Primary>
          <Button.Secondary onClick={status === 'paused' ? resume : pause}>{status === 'paused' ? 'Resume' : 'Pause'}</Button.Secondary>
          <Button.Secondary onClick={() => increment(10_000)}>10s +</Button.Secondary>
          <Button.Destructive onClick={() => reset()}>Reset</Button.Destructive>
        </div>
      </Layout>
  );
}
