import * as React from 'react';

export type CameraCaptureFormat = 'image/jpeg' | 'image/png';

export interface CameraCaptureOutput {
  /**
   * Image quality (0.0 - 1.0)
   * Only applies to lossy formats (JPEG).
   */
  quality?: number;

  /**
   * MIME type of the captured image.
   */
  type: CameraCaptureFormat;
}

export interface UseCameraCaptureOptions {
  format?: CameraCaptureOutput;

  /**
   * Optional callback executed after a photo is captured.
   * Provides both the base64 data URL and the Blob representation.
   */
  onCapture?: (dataUrl: string, blob: Blob) => void;

  /**
   * Desired output width for the captured image.
   * The height is automatically calculated to preserve the aspect ratio.
   *
   * @default 320
   */
  width?: number;
}

export interface UseCameraCaptureReturn {
  /**
   * Ref to the offscreen HTMLCanvasElement used for frame capture.
   */
  canvasRef: React.RefObject<HTMLCanvasElement | null>;

  /**
   * Captures the current video frame and renders it to the canvas.
   */
  capture: () => string | null;

  /**
   * Ref to the HTMLImageElement where the captured photo can be rendered.
   */
  imageRef: React.RefObject<HTMLImageElement | null>;

  /**
   * Requests camera permissions and starts the video stream.
   * Can be safely called again if the user initially denied access.
   */
  requestPermission: () => Promise<boolean>;

  /**
   * Stops all active media tracks and releases the camera.
   */
  stop: () => void;

  /**
   * Indicates whether camera permissions has been granted.
   */
  usePermission: () => boolean;

  /**
   * Indicates whether the video stream is currently active.
   */
  useStreaming: () => boolean;

  /**
   * Ref to the HTMLVideoElement that renders the live camera stream.
   */
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

type Listener = () => void;

function createExternalStore<T>(getSnapshot: () => T) {
  const listeners = new Set<Listener>();

  return {
    getSnapshot,
    notify() {
      listeners.forEach((l) => l());
    },
    subscribe(listener: Listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

/**
 * Unopinionated, SSR-safe React hook for capturing still photos from the user's camera using getUserMedia and Canvas.
 *
 * @example
 * ```tsx
 * const { videoRef, requestPermission, capture } = useCameraCapture();
 * ```
 */
export function useCameraCapture(options: UseCameraCaptureOptions = {}): UseCameraCaptureReturn {
  const { onCapture, width = 320 } = options;
  const output = {
    quality: options.format?.quality ?? 0.8,
    type: options.format?.type ?? 'image/png',
  }

  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const imageRef = React.useRef<HTMLImageElement | null>(null);

  const streamRef = React.useRef<MediaStream | null>(null);
  const streamingRef = React.useRef<boolean>(false);
  const heightRef = React.useRef<number>(0);

  const isBrowser = typeof window !== 'undefined';

  const permissionStoreRef = React.useRef(createExternalStore(() => !!streamRef.current));
  const streamingStoreRef = React.useRef(createExternalStore(() => streamingRef.current));

  const requestPermission = React.useCallback(async (): Promise<boolean> => {
    if (!isBrowser) return false;
    if (!navigator.mediaDevices?.getUserMedia) return false;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true,
      });
      streamRef.current = stream;
      permissionStoreRef.current.notify();

      const video = videoRef.current;
      if (!video) return false;

      video.srcObject = stream;
      await video.play();

      if (!streamingRef.current) {
        const { videoHeight, videoWidth } = video;
        heightRef.current = videoHeight / (videoWidth / width);
        video.width = width;
        video.height = heightRef.current;

        const canvas = canvasRef.current;
        if (canvas) {
          canvas.width = width;
          canvas.height = heightRef.current;
        }
        streamingRef.current = true;
        streamingStoreRef.current.notify();
      }
      return true;
    } catch {
      return false;
    }
  }, [isBrowser, width]);

  const capture = React.useCallback((): string | null => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const image = imageRef.current;

    if (!video || !canvas || !streamingRef.current) return null;

    const context = canvas.getContext('2d');
    if (!context) return null;

    canvas.width = width;
    canvas.height = heightRef.current;

    context.drawImage(video, 0, 0, width, heightRef.current);

    const dataUrl = canvas.toDataURL(output.type, output.quality);
    image?.setAttribute('src', dataUrl);

    if (onCapture) {
      canvas.toBlob((blob) => {
        if (blob) onCapture(dataUrl, blob);
      }, output.type, output.quality);
    }
    return dataUrl;
  }, [onCapture, width, output.quality, output.type]);

  const stop = React.useCallback(() => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    streamingRef.current = false;
    permissionStoreRef.current.notify();
    streamingStoreRef.current.notify();
  }, []);

  const usePermission = () => React.useSyncExternalStore(
    permissionStoreRef.current.subscribe,
    permissionStoreRef.current.getSnapshot,
    () => false
  );

  const useStreaming = () => React.useSyncExternalStore(
    streamingStoreRef.current.subscribe,
    streamingStoreRef.current.getSnapshot,
    () => false
  );

  return {
    canvasRef,
    capture,
    imageRef,
    requestPermission,
    stop,
    usePermission,
    useStreaming,
    videoRef,
  }
}
