'use client';

import { useCallback } from "react";

import { useWebsocket } from "../../../../../../src";
import { Button } from "@/components/ui/Button";
import { Layout } from "@/layouts/Layout";

export default function Demo() {
  const handleOnMessage = useCallback((msg: string) => {
    console.log(msg);
  }, []);

  const {
    connect,
    disconnect,
    error,
    isConnected,
    messages,
    send
  } = useWebsocket<string>({
    autoConnect: false,
    onMessage: handleOnMessage,
    url: 'wss://echo.websocket.org',
  })

  const handleSend = () => {
    send('Hello world!');
  }
  return (
    <Layout>
      <Layout.Title>Websocket</Layout.Title>
      <div className="grid grid-cols-2 md:flex md:flex-row items-center justify-center gap-2">
        <Button.Secondary className="max-md:w-full" disabled={isConnected} onClick={connect}>
          Connect
        </Button.Secondary>
        <Button.Primary className="max-md:w-full" disabled={!isConnected} onClick={handleSend}>
          Send message
        </Button.Primary>
        <Button.Destructive className="max-md:col-span-full max-md:w-full"disabled={!isConnected} onClick={disconnect}>
          Disconnect
        </Button.Destructive>
      </div>
      <div className="flex flex-col gap-1.5 items-center justify-center">
        {messages?.map((msg, idx) => (
          <Layout.Caption key={idx}>{JSON.stringify(msg)}</Layout.Caption>
        ))}
      </div>
      <Layout.Error>{error?.message}</Layout.Error>
    </Layout>
  )
}
