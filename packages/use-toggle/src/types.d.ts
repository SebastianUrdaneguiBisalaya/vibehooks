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