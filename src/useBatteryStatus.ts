import * as React from 'react';

export interface BatteryStatus {
    /** Indicates whether the device is currently charging. */
    charging: boolean | null;

    /** Battery level represented as a value between 0.0 and 1.0 */
    level: number | null;

    /** Time in seconds until the battery is fully charged. `Infinity` means the battery is already full or charging is not applicable. */
    chargingTime: number | null;

    /** Time in seconds until the battery is completely discharged. `Infinity` means the system cannot determine the remaining time. */
    dischargingTime: number | null;
}

export interface UseBatteryStatusReturn {
    /** Indicates whether the Battery Status API is supported in the current runtime environment. */
    isSupported: boolean;

    /** Raw battery information. Values are `null` until the Battery Manager is resolved. */
    battery: BatteryStatus;
}

export {};

declare global {
    interface BatteryManager extends EventTarget {
        readonly charging: boolean;
        readonly level: number;
        readonly chargingTime: number;
        readonly dischargingTime: number;

        addEventListener(
            type:
                | 'chargingchange'
                | 'levelchange'
                | 'chargingtimechange'
                | 'dischargingtimechange',
            listener: EventListenerOrEventListenerObject,
            options?: boolean | AddEventListenerOptions,
        ): void;

        removeEventListener(
            type:
                | 'chargingchange'
                | 'levelchange'
                | 'chargingtimechange'
                | 'dischargingtimechange',
            listener: EventListenerOrEventListenerObject,
            options?: boolean | EventListenerOptions,
        ): void;
    }

    interface Navigator {
        getBattery(): Promise<BatteryManager>;
    }
}

/**
 * `useBatteryStatus`is a hook that provides information about the system's battery charge level and lets you be notified by events that are sent when the battery level or charging status changes.
 * This hook uses the native 'Battery Status API and it is not available in Web Workers and it is available only in secure contexts (HTTPS).
 *
 * @returns An object containing the battery status and a boolean indicating whether the Battery Status API is supported in the current runtime environment.
 *
 * @example
 * ```tsx
 * const { isSupported, battery } = useBatteryStatus();
 * 
 * if (!isSupported) {
 *   return <span>Battery API not supported</span>;
 * }
 * return (
 *  <div>
 *   <p>Charging: {battery.charging ? 'Yes' : 'No'}</p>
 *   <p>Level: {battery.level}</p>
 *  </div>
);
 * ```
 *
 * @author Sebastian Marat Urdanegui Bisalaya <sebastianurdanegui.com>
 *
 * @since 0.0.1
 * @version 0.0.1
 * 
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Battery_Status_API
 *
 */
export function useBatteryStatus(): UseBatteryStatusReturn {
    const isSupported = typeof navigator !== 'undefined' && typeof navigator.getBattery === 'function';

    const [battery, setBattery] = React.useState<BatteryStatus>({
        charging: null,
        level: null,
        chargingTime: null,
        dischargingTime: null,
    });

    React.useEffect(() => {
        if (!isSupported) return;

        let batteryManager: BatteryManager | null = null;

        const updateBatteryState = () => {
            if (!batteryManager) return;

            setBattery({
                charging: batteryManager.charging,
                level: batteryManager.level,
                chargingTime: batteryManager.chargingTime,
                dischargingTime: batteryManager.dischargingTime,
            });
        };

        navigator.getBattery().then((bm) => {
            batteryManager = bm;
            updateBatteryState();
            bm.addEventListener('chargingchange', updateBatteryState);
            bm.addEventListener('levelchange', updateBatteryState);
            bm.addEventListener('chargingtimechange', updateBatteryState);
            bm.addEventListener('dischargingtimechange', updateBatteryState);
        });

        return () => {
            if (!batteryManager) return;
            batteryManager.removeEventListener('chargingchange', updateBatteryState);
            batteryManager.removeEventListener('levelchange', updateBatteryState);
            batteryManager.removeEventListener('chargingtimechange', updateBatteryState);
            batteryManager.removeEventListener('dischargingtimechange', updateBatteryState);
        }

    }, [isSupported]);

    return {
        isSupported,
        battery,
    }
}
