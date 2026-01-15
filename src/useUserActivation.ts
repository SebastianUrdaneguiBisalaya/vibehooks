import * as React from 'react';

export interface UseUserActivationResult {
  /**
   * Whether the user has ever interacted with the document.
   */
  hasBeenActive: boolean;

  /**
   * Whether there is a current transient user activation.
   */
  isActive: boolean;

  /**
   * Forces a re-read of the current activation state.
   */
  refresh: () => void;

  /**
   * Indicates whether the UserActivation API is supported.
   */
  isSupported: boolean;
}

/**
 * `useUserActivation` is a React hook that exposes the browser User Activation State.
 * This hook provides read-only access to `navigator.userActivation` allowing consumers to react to transient and persistent user activation without imposing side effects or control flow.
 *
 * @returns User activation state and helpers.
 *
 * @example
 * ```tsx
 * const { isActive, hasBeenActive } = useUserActivation();
 *
 * if (!hasBeenActive) {
 *   return <p>Please interact with the page.</p>;
 * }
 *
 * if (isActive) {
 *   runSensitiveAction();
 * }
 * ```
 *
 * @author Sebastian Marat Urdanegui Bisalaya <https://sebastianurdanegui.com>
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/UserActivation
 * @since 0.0.1
 * @version 0.0.1
 *
 */
export function useUserActivation(): UseUserActivationResult {
  const isSupported = typeof navigator !== 'undefined' && typeof navigator.userActivation !== 'undefined';

  const readState = React.useCallback(() => {
    if (!isSupported) {
      return {
        isActive: false,
        hasBeenActive: false,
      }
    }
    return {
      hasBeenActive: navigator.userActivation.hasBeenActive,
      isActive: navigator.userActivation.isActive,
    };
  }, [isSupported]);

  const [state, setState] = React.useState(() => readState());

  const refresh = React.useCallback(() => {
    setState(readState());
  }, [readState]);

  React.useEffect(() => {
    if (!isSupported) return;

    const events: Array<keyof WindowEventMap> = [
      'mousedown',
      'keydown',
      'touchstart',
      'pointerdown',
    ];

    const handler = () => {
      refresh();
    };

    events.forEach((event) => window.addEventListener(event, handler, { passive: true }))
    return () => {
      events.forEach((event) => window.removeEventListener(event, handler))
    }
  }, [isSupported, refresh]);

  return {
    hasBeenActive: state.hasBeenActive,
    isActive: state.isActive,
    refresh,
    isSupported,
  }
}
