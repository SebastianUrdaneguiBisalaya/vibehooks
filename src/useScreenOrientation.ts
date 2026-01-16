import * as React from 'react';

export {};

declare global {
  interface ScreenOrientation {
    lock(orientation: ScreenOrientationLock): Promise<void>;
    unlock(): void;
  }

  type ScreenOrientationLock =
    | 'any'
    | 'natural'
    | 'portrait'
    | 'landscape'
    | 'portrait-primary'
    | 'portrait-secondary'
    | 'landscape-primary'
    | 'landscape-secondary';
}

type OrientationType =
  | 'portrait-primary'
  | 'portrait-secondary'
  | 'landscape-primary'
  | 'landscape-secondary';

export interface UseScreenOrientationResult {
  /**
   * Current orientation type (e.g. portrait-primary).
   */
  type: OrientationType | null;

  /**
   * Current orientation angle in degrees.
   */
  angle: number | null;

  /**
   * Locks the screen orientation.
   */
  lock: (orientation: ScreenOrientationLock) => Promise<void>;

  /**
   * Unlocks the screen orientation.
   */
  unlock: () => void;

  /**
   * Whether the Screen Orientation API is supported.
   */
  isSupported: boolean;
}

/**
 * `useScreenOrientation` provides unopinionated access to the Screen Orientation API.
 * It exposes current orientation state and helpers to lock/unlock orientation without imposing UI decisiones.
 *
 * @returns Screen orientation helpers and state.
 *
 * @example
 * ```tsx
 * const orientation = useScreenOrientation();
 *
 * if (orientation.type === 'landscape-primary') {
 *   // adapt layout
 * }
 * ```
 *
 * @author Sebastian Marat Urdanegui Bisalaya <https://sebastianurdanegui.com>
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Screen_Orientation_API
 * @since 0.0.1
 * @version 0.0.1
 *
 */
export function useScreenOrientation(): UseScreenOrientationResult {
  const isSupported = typeof screen !== 'undefined' && screen.orientation !== undefined;
  const [type, setType] = React.useState<OrientationType | null>(isSupported ? screen.orientation.type : null);
  const [angle, setAngle] = React.useState<number | null>(isSupported ? screen.orientation.angle : null);

  const lock = React.useCallback(async (orientation: ScreenOrientationLock) => {
    if (!isSupported) return;
    await screen.orientation.lock(orientation);
  }, [isSupported]);

  const unlock = React.useCallback(() => {
    if (!isSupported) return;
    screen.orientation.unlock();
  }, [isSupported]);

  React.useEffect(() => {
    if (!isSupported) return;
    const handleChange = () => {
      setType(screen.orientation.type);
      setAngle(screen.orientation.angle);
    };
    screen.orientation.addEventListener('change', handleChange);
    return () => {
      screen.orientation.removeEventListener('change', handleChange);
    }
  }, [isSupported]);

  return {
    isSupported,
    type,
    angle,
    lock,
    unlock,
  }
}
