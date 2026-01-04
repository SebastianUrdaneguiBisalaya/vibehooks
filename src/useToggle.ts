import * as React from 'react';

export interface ToggleOptions {
    /**
     * Default value for the toggle.
     */
    defaultValue?: boolean;
}

export interface ToggleReturn {
    /**
     * Current status of the toggle.
     */
    status: boolean;

    /**
     * Handles the toggle.
     */
    handleToggle: () => void;
}

/**
 * `useToggle` returns a toggle state and a function to toggle the state.
 * 
 * @param `defaultValue` Default value for the toggle.
 * 
 * @returns 
 * 
 * @example
 * ```tsx
 * const { status, handleToggle } = useToggle({ defaultValue: false });
 * ```
 * 
 * @author Sebastian Marat Urdanegui Bisalaya <sebastianurdanegui.com>
 * 
 * @since 0.0.1
 * @version 0.0.1
 * 
 */
export function useToggle({ defaultValue = false }: ToggleOptions): ToggleReturn {
    const [status, setStatus] = React.useState<boolean>(defaultValue);

    const handleToggle = React.useCallback(() => {
        return setStatus(prev => !prev);
    }, []);

    return {
        status,
        handleToggle
    }
}