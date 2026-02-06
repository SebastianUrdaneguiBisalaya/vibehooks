import * as React from 'react';

export interface ToggleOptions {
	/**
	 * Default value for the toggle.
	 */
	defaultValue?: boolean;
}

export interface ToggleReturn {
	/**
	 * Handles the toggle.
	 */
	handleToggle: () => void;

	/**
	 * Current status of the toggle.
	 */
	status: boolean;
}

/**
 * `useToggle` returns a toggle state and a function to toggle the state.
 *
 * @example
 * ```tsx
 * const { status, handleToggle } = useToggle({ defaultValue: false });
 * ```
 */
export function useToggle({
	defaultValue = false,
}: ToggleOptions): ToggleReturn {
	const [status, setStatus] = React.useState<boolean>(defaultValue);

	const handleToggle = React.useCallback(() => {
		return setStatus(prev => !prev);
	}, []);

	return {
		handleToggle,
		status,
	};
}
