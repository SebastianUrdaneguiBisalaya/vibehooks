'use client';

import { useAudio } from "../../../../../../src";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { Layout } from "@/layouts/Layout";

export default function Demo() {
  const { error, pause, play, status} = useAudio({ src: '/music.mp3' });
  return (
    <Layout>
      <Layout.Title>Audio</Layout.Title>
      <Tag.Primary>Status: {status}</Tag.Primary>
      <Layout.Error>Error: {error?.message}</Layout.Error>
      <div className="flex flex-row items-center gap-2">
        <Button.Primary onClick={play}>Play</Button.Primary>
        <Button.Secondary onClick={pause}>Pause</Button.Secondary>
      </div>
    </Layout>
  )
}
