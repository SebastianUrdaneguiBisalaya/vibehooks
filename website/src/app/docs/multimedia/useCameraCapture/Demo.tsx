'use client';

import { useCameraCapture } from "../../../../../../src";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { Layout } from "@/layouts/Layout";

export default function Demo() {
  const {
    canvasRef,
    capture,
    imageRef,
    requestPermission,
    stop,
    usePermission,
    useStreaming,
    videoRef,
  } = useCameraCapture({
    onCapture: (dataUrl, blob) => {
      console.log("Photo taken!", {
        size: blob.size,
        type: blob.type,
      })
    }
  });

  const hasPermission = usePermission();
  const isStreaming = useStreaming();

  return (
    <Layout>
      <Layout.Title>Camera Capture</Layout.Title>
      <div className="flex flex-row items-center justify-center gap-2">
        <Tag.Primary>Permission: {hasPermission ? 'Granted' : 'Denied'}</Tag.Primary>
        <Tag.Primary>Streaming: {isStreaming ? 'Active' : 'Inactive'}</Tag.Primary>
      </div>
      <div className="flex flex-row items-center justify-center gap-2">
        <Button.Secondary disabled={isStreaming} onClick={requestPermission}>
          Enable
        </Button.Secondary>
        <Button.Primary disabled={!isStreaming} onClick={capture}>
          Capture
        </Button.Primary>
        <Button.Destructive disabled={!isStreaming} onClick={stop}>
          Stop
        </Button.Destructive>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="flex flex-col items-center gap-1.5">
          <Layout.Caption className="text-center">Live Stream</Layout.Caption>
          <video
            autoPlay
            className="aspect-video w-full rounded-md"
            playsInline
            ref={videoRef}
          />
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <Layout.Caption className="text-center">Last Capture</Layout.Caption>
          <img
            alt="Last capture"
            className="aspect-square w-full min-h-28 rounded-md"
            ref={imageRef}
          />
        </div>
      </div>
      <canvas className="hidden" ref={canvasRef} />
    </Layout>
  )
}
