import * as React from 'react';

/**
 * `useIsClient` returns true if the code is running in the browser. Otherwise, it returns false if the code is running on the server.
 *
 * @example
 * ```tsx
 * const isClient = useIsClient();
 * ```
 *
 * @author Sebastian Marat Urdanegui Bisalaya <https://sebastianurdanegui.com>
 *
 * @version 0.0.1
 *
 */
export function useIsClient(): boolean {
	const [isClient, setIsClient] = React.useState<boolean>(false);

	React.useEffect(() => {
		setIsClient(true);
	}, []);

	return isClient;
}
