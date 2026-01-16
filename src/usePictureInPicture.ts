import * as React from 'react';

export interface UsePictureInPictureResult {
  /**
   * Whether Picture-in-Picture is supported by the browser.
   */
  isSupported: boolean;

  /**
   * Whether the video is currently in Picture-in-Picture mode.
   */
  isActive: boolean;

  /**
   * Requests Picture-in-Picture for the attached video element.
   */
  enter: () => Promise<void>;

  /**
   * Exits Picture-in-Picture mode if active.
   */
  exit: () => Promise<void>;

  /**
   * Ref to the HTMLVideoElement.
   */
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

/**
 * `usePictureInPicture` provides unopinionated access to the Picture-in-Picture Web API for HTMLVideoElement.
 * It manages PiP lifecycle and state but leaves UI and UX decisions to the consumer.
 *
 * @returns Picture-in-Picture helpers and state.
 *
 * @example
 * ```tsx
 * const pip = usePictureInPicture();
 *
 * return (
 *   <>
 *     <video ref={pip.videoRef} src="/video.mp4" controls />
 *     <button onClick={pip.enter} disabled={!pip.isSupported}>
 *       PiP
 *     </button>
 *   </>
 * );
 * ```
 *
 * @author Sebastian Marat Urdanegui Bisalaya <https://sebastianurdanegui.com>
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Picture-in-Picture_API
 * @since 0.0.1
 * @version 0.0.1
 *
 */
export function usePictureInPicture(): UsePictureInPictureResult {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const [isActive, setIsActive] = React.useState<boolean>(false);

  const isSupported = typeof document !== 'undefined' && 'pictureInPictureEnabled' in document;

  const enter = React.useCallback(async () => {
    if (!isSupported) return;
    const video = videoRef.current;
    if (!video) return;
    if (document.pictureInPictureElement) return;
    await video.requestPictureInPicture();
  }, [isSupported]);

  const exit = React.useCallback(async () => {
    if (!isSupported) return;
    if (!document.pictureInPictureElement) return;
    await document.exitPictureInPicture();
  }, [isSupported]);

  React.useEffect(() => {
    if (!isSupported) return;
    const onEnter = () => setIsActive(true);
    const onExit = () => setIsActive(false);

    document.addEventListener('enterpictureinpicture', onEnter);
    document.addEventListener('leavepictureinpicture', onExit);

    return () => {
      document.removeEventListener('enterpictureinpicture', onEnter);
      document.removeEventListener('leavepictureinpicture', onExit);
    }
  }, [isSupported]);

  return {
    isSupported,
    isActive,
    enter,
    exit,
    videoRef,
  }
}
