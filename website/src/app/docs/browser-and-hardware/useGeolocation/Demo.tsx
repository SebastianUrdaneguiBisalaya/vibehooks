'use client';

import { useState, useEffect } from 'react';

import { useGeolocation } from "../../../../../../src";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { Layout } from "@/layouts/Layout";

export default function Demo() {
  const { clearWatch, error, getCurrentPosition, isSupported, permissionState, position, watchPosition } = useGeolocation();

  const [watcherId, setWatcherId] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => setIsMounted(true), 100);
  }, []);

  if (!isMounted) {
    return (
      <Layout>
        <Layout.ContentLoading />
      </Layout>
    )
  }

  if (!isSupported) {
    return (
      <Layout>
        <Layout.ContentNotSupported>
          The Geolocation API is not supported in this browser.
        </Layout.ContentNotSupported>
      </Layout>
    )
  }

  const toggleTracking = () => {
    if (watcherId !== null) {
      clearWatch(watcherId);
      setWatcherId(null);
    } else {
      const id = watchPosition({ enableHighAccuracy: true });
      setWatcherId(id);
    }
  };

  return (
    <Layout>
      <Layout.Title>Geolocation</Layout.Title>
      <Tag.Primary>
        Status: {permissionState}
      </Tag.Primary>

      {!isSupported ? (
        <p className="text-sm text-red-500 bg-red-50 p-3 rounded font-reddit-sans">Geolocation not supported.</p>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col items-center p-2 border border-white/20 rounded-md space-y-2">
              <Layout.Caption className='font-bold'>Latitude</Layout.Caption>
              <Layout.Paragraph>{position?.coords.latitude.toFixed(6) ?? '—'}</Layout.Paragraph>
            </div>
            <div className="flex flex-col items-center p-2 border border-white/20 rounded-md space-y-2">
              <Layout.Caption className='font-bold'>Longitude</Layout.Caption>
              <Layout.Paragraph>{position?.coords.longitude.toFixed(6) ?? '—'}</Layout.Paragraph>
            </div>
          </div>

          {error && <Layout.Error>Error: {error.message}</Layout.Error>}

          <div className="flex gap-2">
            <Button.Primary onClick={() => getCurrentPosition()}>
              Get once
            </Button.Primary>
            <Button.Secondary onClick={toggleTracking}>
              {watcherId !== null ? 'Stop' : 'Start'}
            </Button.Secondary>
          </div>
        </div>
      )}
    </Layout>
  )
}
