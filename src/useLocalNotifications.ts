import * as React from 'react';

export interface UseLocalNotificationReturn {
	isSupported: boolean;
	notify: (options: UseNotificationOptions) => void;
	permission: NotificationPermission;
	requestPermission: () => Promise<NotificationPermission>;
}

export interface UseNotificationOptions extends NotificationOptions {
	title: string;
}

/**
 * `useLocalNotifications` is React hook for managing local notifications in the browser.
 *
 * @example
 * ```tsx
 * const { notify, requestPermission, permission } = useNotifications();
 * notify({ title: 'Hello', body: 'World' });
 * ```
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Notification
 */
export function useLocalNotifications(): UseLocalNotificationReturn {
	const [permission, setPermission] = React.useState<NotificationPermission>(
		typeof window !== 'undefined' && 'Notification' in window
			? Notification.permission
			: 'default'
	);
	const isSupported = typeof window !== 'undefined' && 'Notification' in window;

	const requestPermission = React.useCallback(async () => {
		if (!isSupported) return 'denied';
		const result = await Notification.requestPermission();
		setPermission(result);
		return result;
	}, [isSupported]);

	const notify = React.useCallback(
		({
			badge,
			body,
			data,
			dir,
			icon,
			lang,
			requireInteraction,
			silent,
			tag,
			title,
		}: UseNotificationOptions) => {
			if (!isSupported) return;
			if (permission !== 'granted') {
				console.warn('Notifications are not allowed.');
				return;
			}
			const options: NotificationOptions = {
				...(badge !== undefined && { badge }),
				...(body !== undefined && { body }),
				...(data !== undefined && { data }),
				...(dir !== undefined && { dir }),
				...(icon !== undefined && { icon }),
				...(lang !== undefined && { lang }),
				...(requireInteraction !== undefined && { requireInteraction }),
				...(silent !== undefined && { silent }),
				...(tag !== undefined && { tag }),
			};
			new Notification(title, options);
		},
		[permission, isSupported]
	);

	return {
		isSupported,
		notify,
		permission,
		requestPermission,
	};
}
