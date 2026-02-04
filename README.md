<p align="center">
    <img src="./public/logo.png" alt="useful-react-hooks" height="40px">
</p>

<p align="center" style="font-size: 1.2rem; font-weight: bold;">
Modern React and Next.js hooks, unopinionated and focused on developer experience.
</p>

## **Installation**

**Coming soon...**

You can install the package with the following command:
By default, these commands will install all the hooks in the package.

Using `npm`:

```bash
npm install @vibehooks/react
```

Using `pnpm`:

```bash
pnpm add @vibehooks/react
```

But you can also install only the hooks you need with the following command:

Using `npm`:

```bash
npm install @vibehooks/use-toggle
```

Using `pnpm`:

```bash
pnpm add @vibehooks/use-toggle
```

That package is fully typed with TypeScript and comes with all the types you need.
You can use the types just by importing them from the package like this:

```ts
import { useToggle, type UseToggleReturn } from '@vibehooks/use-toggle';
```

## **Contributing**

Contributions are always welcome!

See [`Contributing`](https://github.com/SebastianUrdaneguiBisalaya/vibehooks?tab=contributing-ov-file) for ways to get started.

If you do not want create your custom hook, you can also contribute to the package by mentioning the name and purpose of the hook you would like to see in this package in the [issues](https://github.com/SebastianUrdaneguiBisalaya/vibehooks/issues) section.

## **API Docs**

| **Hook**                                                                                                                          | **Description**                                                                                                                                  |
| --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| [**useAsyncState**](https://github.com/SebastianUrdaneguiBisalaya/vibehooks/blob/main/src/useAsyncState.ts)                       | A robust React hook for managing asynchronous operations and remote data fetching with integrated state tracking and retry logic.                |
| [**useAudio**](https://github.com/SebastianUrdaneguiBisalaya/vibehooks/blob/main/src/useAudio.ts)                                 | A React hook providing a declarative and unopinionated interface to manage the HTML5 Audio API lifecycle.                                        |
| [**useAutoScroll**](https://github.com/SebastianUrdaneguiBisalaya/vibehooks/blob/main/src/useAutoScroll.ts)                       | A custom hook that automatically manages scrolling to the bottom of a container while respecting manual user navigation.                         |
| [**useBarcode**](https://github.com/SebastianUrdaneguiBisalaya/vibehooks/blob/main/src/useBarcode.ts)                             | A React hook that provides a high-level interface for detecting barcodes and QR codes in real-time using the browser's Barcode Detection API.    |
| [**useBatteryStatus**](https://github.com/SebastianUrdaneguiBisalaya/vibehooks/blob/main/src/useBatteryStatus.ts)                 | A hardware-integration hook that provides real-time access to the system's battery levels, charging state, and timing estimates.                 |
| [**useBodyScrollFreeze**](https://github.com/SebastianUrdaneguiBisalaya/vibehooks/blob/main/src/useBodyScrollFreeze.ts)           | An imperative hook to disable body scrolling on specific axes while maintaining the user's current scroll position.                              |
| [**useCookies**](https://github.com/SebastianUrdaneguiBisalaya/vibehooks/blob/main/src/useCookies.ts)                             | A React hook that provides an unopinionated interface for managing browser cookies with standard configuration options.                          |
| [**useCameraCapture**](https://github.com/SebastianUrdaneguiBisalaya/vibehooks/blob/main/src/useCameraCapture.ts)                 | A hook that manages camera access and simplifies capturing still images from a live video stream via a canvas element.                           |
| [**useCopyToClipboard**](https://github.com/SebastianUrdaneguiBisalaya/vibehooks/blob/main/src/useCopyToClipboard.ts)             | A hook to copy text to the system clipboard using the modern Clipboard API.                                                                      |
| [**useCountDown**](https://github.com/SebastianUrdaneguiBisalaya/vibehooks/blob/main/src/useCountDown.ts)                         | High-precision React hook for managing synchronized countdown timers with manual lifecycle controls and drift-correction.                        |
| [**useDebouncedState**](https://github.com/SebastianUrdaneguiBisalaya/vibehooks/blob/main/src/useDebouncedState.ts)               | A state management hook that tracks immediate value changes while providing a delayed update for performance-heavy operations.                   |
| [**useExternalNotifications**](https://github.com/SebastianUrdaneguiBisalaya/vibehooks/blob/main/src/useExternalNotifications.ts) | Manages and synchronizes system notifications across multiple contexts using a global external store.                                            |
| [**useGeolocation**](https://github.com/SebastianUrdaneguiBisalaya/vibehooks/blob/main/src/useGeolocation.ts)                     | A comprehensive, SSR-safe hook for interfacing with the Geolocation API and Permissions API to track device coordinates and access status.       |
| [**useHoverIntent**](https://github.com/SebastianUrdaneguiBisalaya/vibehooks/blob/main/src/useHoverIntent.ts)                     | A detection hook that distinguishes between accidental mouse-overs and intentional user hovers.                                                  |
| [**useFile**](https://github.com/SebastianUrdaneguiBisalaya/vibehooks/blob/main/src/useFile.ts)                                   | Manages file selection state and provides input-ready props for uploads and drag-and-drop.                                                       |
| [**useFullscreen**](https://github.com/SebastianUrdaneguiBisalaya/vibehooks/blob/main/src/useFullScreen.ts)                       | A declarative interface for managing the browser Fullscreen API on a specific DOM element.                                                       |
| [**useIdle**](https://github.com/SebastianUrdaneguiBisalaya/vibehooks/blob/main/src/useIdle.ts)                                   | An SSR-safe hook to monitor user inactivity by tracking browser interaction events and exposing real-time idle status based on a custom timeout. |
| [**useIndexedDB**](https://github.com/SebastianUrdaneguiBisalaya/vibehooks/blob/main/src/useIndexedDB.ts)                         | A React hook that abstracts the boilerplate of the IndexedDB API, facilitating database connections and transaction management.                  |
| [**useIntersectionObserver**](https://github.com/SebastianUrdaneguiBisalaya/vibehooks/blob/main/src/useIntersectionObserver.ts)   | A hook that monitors the visibility and intersection of a DOM element within a viewport.                                                         |
| [**useIntervalSafe**](https://github.com/SebastianUrdaneguiBisalaya/vibehooks/blob/main/src/useIntervalSafe.ts)                   | A declarative and robust React hook for managing **setInterval** lifecycles with execution limits and manual controls.                           |
| [**useIsClient**](https://github.com/SebastianUrdaneguiBisalaya/vibehooks/blob/main/src/useIsClient.ts)                           | Returns true if the code is running in the browser and false if it is running on the server.                                                     |
| [**useIsDesktop**](https://github.com/SebastianUrdaneguiBisalaya/vibehooks/blob/main/src/useIsDesktop.ts)                         | Determines if the current viewport width meets or exceeds a specified desktop breakpoint.                                                        |
| [**useIsFirstRender**](https://github.com/SebastianUrdaneguiBisalaya/vibehooks/blob/main/src/useIsFirstRender.ts)                 | Tracks whether the current render cycle is the initial mount of the component.                                                                   |
| [**useList**](https://github.com/SebastianUrdaneguiBisalaya/vibehooks/blob/main/src/useList.ts)                                   | A stateful array management hook providing memoized utility functions for CRUD operations on lists.                                              |
| [**useLocalStorage**](https://github.com/SebastianUrdaneguiBisalaya/vibehooks/blob/main/src/useLocalStorage.ts)                   | A typed React hook for interacting with the Web Storage API, providing automatic JSON serialization and fallback support.                        |
| [**useLocaleNotifications**](https://github.com/SebastianUrdaneguiBisalaya/vibehooks/blob/main/src/useLocalNotifications.ts)      | Provides a direct interface to trigger browser system notifications within a component.                                                          |
| [**useNetworkInformation**](https://github.com/SebastianUrdaneguiBisalaya/vibehooks/blob/main/src/useNetworkInformation.ts)       | A performance-aware hook that provides real-time network telemetry and user connectivity preferences to adapt application behavior.              |
| [**usePageVisibility**](https://github.com/SebastianUrdaneguiBisalaya/vibehooks/blob/main/src/usePageVisibility.ts)               | Provides the current visibility state of the document using the Page Visibility API.                                                             |
| [**usePermissions**](https://github.com/SebastianUrdaneguiBisalaya/vibehooks/blob/main/src/usePermissions.ts)                     | A reactive hook that observes and synchronizes browser permission statuses in real-time.                                                         |
| [**usePictureInPicture**](https://github.com/SebastianUrdaneguiBisalaya/vibehooks/blob/main/src/usePictureInPicture.ts)           | A specialized hook to manage the Picture-in-Picture (PiP) Web API for floating video playback.                                                   |
| [**usePopover**](https://github.com/SebastianUrdaneguiBisalaya/vibehooks/blob/main/src/usePopover.ts)                             | A lifecycle management hook for popover UI elements that handles visibility and "click-outside" logic.                                           |
| [**usePreferredTheme**](https://github.com/SebastianUrdaneguiBisalaya/vibehooks/blob/main/src/usePreferredTheme.ts)               | Resolves the effective theme by reconciling system preferences and manual user selection.                                                        |
| [**usePreferredLanguage**](https://github.com/SebastianUrdaneguiBisalaya/vibehooks/blob/main/src/usePreferredLanguage.ts)         | Manages and resolves the application language based on system settings and user overrides.                                                       |
| [**usePreviousDistinct**](https://github.com/SebastianUrdaneguiBisalaya/vibehooks/blob/main/src/usePreviousDistinct.ts)           | A utility hook that captures the last distinct value of a variable, filtering out redundant consecutive updates.                                 |
| [**useResettableState**](https://github.com/SebastianUrdaneguiBisalaya/vibehooks/blob/main/src/useResettableState.ts)             | Extends standard state management with a memoized reset mechanism to revert to the initial value.                                                |
| [**useScreenOrientation**](https://github.com/SebastianUrdaneguiBisalaya/vibehooks/blob/main/src/useScreenOrientation.ts)         | A React hook that provides real-time access to the device's screen orientation state and control methods via the Screen Orientation API.         |
| [**useScreenSize**](https://github.com/SebastianUrdaneguiBisalaya/vibehooks/blob/main/src/useScreenSize.ts)                       | Returns the current inner dimensions of the browser window.                                                                                      |
| [**useScreenWakeLock**](https://github.com/SebastianUrdaneguiBisalaya/vibehooks/blob/main/src/useScreenWakeLock.ts)               | A React hook that provides unopinionated access to the Screen Wake Lock API to prevent devices from dimming or locking the screen.               |
| [**useServerSentEvent**](https://github.com/SebastianUrdaneguiBisalaya/vibehooks/blob/main/src/useServerSentEvent.ts)             | A React hook that provides unopinionated access to the EventSource Web API for receiving real-time server-side updates.                          |
| [**useShoppingCart**](https://github.com/SebastianUrdaneguiBisalaya/vibehooks/blob/main/src/useShoppingCart.ts)                   | A generic, domain-agnostic hook for managing complex shopping cart logic and calculations.                                                       |
| [**useSmartVideo**](https://github.com/SebastianUrdaneguiBisalaya/vibehooks/blob/main/src/useSmartVideo.ts)                       | An advanced video hook that combines intersection logic with playback control for automated "smart" behavior.                                    |
| [**useSpeech**](https://github.com/SebastianUrdaneguiBisalaya/vibehooks/blob/main/src/useSpeech.ts)                               | Provides unopinionated, high-level access to the Web Speech API for speech-to-text recognition.                                                  |
| [**useSummarizer**](https://github.com/SebastianUrdaneguiBisalaya/vibehooks/blob/main/src/useSummarizer.ts)                       | Provides low-level access to the browser's built-in AI Summarizer API.                                                                           |
| [**useTaskQueue**](https://github.com/SebastianUrdaneguiBisalaya/vibehooks/blob/main/src/useTaskQueue.ts)                         | A React hook for managing and executing a sequential queue of asynchronous tasks with automatic concurrency control.                             |
| [**useTimeout**](https://github.com/SebastianUrdaneguiBisalaya/vibehooks/blob/main/src/useTimeout.ts)                             | A declarative React hook for managing the lifecycle of single-execution timers with manual controls and SSR safety.                              |
| [**useThrottledCallback**](https://github.com/SebastianUrdaneguiBisalaya/vibehooks/blob/main/src/useThrottledCallback.ts)         | A performance-optimization hook that limits the execution frequency of a callback to one per specified time window.                              |
| [**useTraceUpdates**](https://github.com/SebastianUrdaneguiBisalaya/vibehooks/blob/main/src/useTraceUpdates.ts)                   | Logs property changes to the console whenever the component updates.                                                                             |
| [**useTranslator**](https://github.com/SebastianUrdaneguiBisalaya/vibehooks/blob/main/src/useTranslator.ts)                       | Enables AI-powered text translation directly within the browser via the Translator API.                                                          |
| [**useToggle**](https://github.com/SebastianUrdaneguiBisalaya/vibehooks/blob/main/src/useToggle.ts)                               | A lightweight, unopinionated hook to manage boolean state toggling with memoized handlers.                                                       |
| [**useUserActivation**](https://github.com/SebastianUrdaneguiBisalaya/vibehooks/blob/main/src/useUserActivation.ts)               | A React hook that tracks the browser's User Activation state to determine if a user has interacted with the page.                                |
| [**useVibration**](https://github.com/SebastianUrdaneguiBisalaya/vibehooks/blob/main/src/useVibration.ts)                         | A React hook that provides an SSR-safe interface to interact with the device's physical vibration hardware.                                      |
| [**useWebsocket**](https://github.com/SebastianUrdaneguiBisalaya/vibehooks/blob/main/src/useWebsocket.ts)                         | A comprehensive React hook for managing WebSocket connections with built-in auto-reconnection logic, message history, and SSR safety.            |

## License

[MIT](https://github.com/SebastianUrdaneguiBisalaya/vibehooks?tab=MIT-1-ov-file)
