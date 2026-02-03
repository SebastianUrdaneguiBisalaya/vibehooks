import * as React from 'react';

export interface NotificationPayload extends NotificationOptions {
	createdAt: number;
	id?: string;
	title: string;
}

export type Listener = () => void;

let notifications: NotificationPayload[] = [];
const listeners = new Set<Listener>();

let isListening = false;

function emit() {
	listeners.forEach(listener => listener());
}

function onStorageEvent(event: StorageEvent) {
	if (event.key !== 'notifications') return;
	try {
		const next = JSON.parse(event.newValue ?? '[]');
		if (Object.is(next, notifications)) return;
		notifications = next;
		emit();
	} catch {
		// TODO: handle error
	}
}

function suscribe(listener: Listener) {
	listeners.add(listener);
	if (!isListening && typeof window !== 'undefined') {
		window.addEventListener('storage', onStorageEvent);
		isListening = true;
	}

	return () => {
		listeners.delete(listener);

		if (listeners.size === 0 && isListening) {
			window.removeEventListener('storage', onStorageEvent);
			isListening = false;
		}
	};
}

function getSnapshot() {
	return notifications;
}

export const notificationStore = {
	getSnapshot,
	push(notification: NotificationPayload) {
		notifications = [...notifications, notification];
		localStorage.setItem('notifications', JSON.stringify(notifications));
		emit();
	},
	suscribe,
};

export interface UseExternalNotificationReturn {
	isSupported: boolean;
	notifications: NotificationPayload[] | null;
	notify: (notification: Omit<NotificationPayload, 'createdAt'>) => void;
	permission: NotificationPermission;
	requestPermission: () => Promise<NotificationPermission>;
}

/**
 * `useExternalNotifications` is React hook for consuming and emitting external notifications using a global store.
 * It is thinking for events outside the normal cycle of React:
 *
 * @example
 * ```tsx
 * function NotificationCenter() {
 *   const { notifications } = useExternalNotification();
 *
 *   return (
 *     <ul>
 *       {notifications.map(n => (
 *         <li key={n.id}>{n.title}</li>
 *       ))}
 *     </ul>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Emit notifications from a WebSocket
 * function useChatSocket() {
 *   const { notify } = useExternalNotification();
 *
 *   React.useEffect(() => {
 *     socket.onmessage = (event) => {
 *       notify({
 *         id: crypto.randomUUID(),
 *         title: 'Nuevo mensaje',
 *         body: event.data,
 *       });
 *     };
 *   }, []);
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Emit notifications from an API
 * function useInvoiceStatus(id: string) {
 *   const { notify } = useExternalNotification();
 *
 *   React.useEffect(() => {
 *     fetch(`/api/invoices/${id}`)
 *       .then(res => res.json())
 *       .then(data => {
 *         if (data.status === 'paid') {
 *           notify({
 *             id: id,
 *             title: 'Factura pagada',
 *             body: `La factura ${id} fue pagada`,
 *           });
 *         }
 *       });
 *   }, [id]);
 * }
 * ```
 *
 * @author Sebastian Marat Urdanegui Bisalaya <https://sebastianurdanegui.com>
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Notification
 * @since 0.0.1
 * @version 0.0.1
 *
 */
export function useExternalNotifications(): UseExternalNotificationReturn {
	const notifications = React.useSyncExternalStore(
		notificationStore.suscribe,
		notificationStore.getSnapshot,
		() => null
	);
	const isSupported = typeof window !== 'undefined' && 'Notification' in window;

	const permission = isSupported ? Notification.permission : 'denied';

	const requestPermission = React.useCallback(async () => {
		if (!isSupported) return 'denied';
		return await Notification.requestPermission();
	}, [isSupported]);

	const notify = React.useCallback(
		(notification: Omit<NotificationPayload, 'createdAt'>) => {
			const payload: NotificationPayload = {
				...notification,
				createdAt: Date.now(),
			};

			notificationStore.push(payload);

			if (!isSupported || permission !== 'granted') return;

			const options: NotificationOptions = {
				...(notification.badge !== undefined && { badge: notification.badge }),
				...(notification.body !== undefined && { body: notification.body }),
				...(notification.data !== undefined && { data: notification.data }),
				...(notification.dir !== undefined && { dir: notification.dir }),
				...(notification.icon !== undefined && { icon: notification.icon }),
				...(notification.lang !== undefined && { lang: notification.lang }),
				...(notification.requireInteraction !== undefined && {
					requireInteraction: notification.requireInteraction,
				}),
			};

			new Notification(payload.title, options);
		},
		[isSupported, permission]
	);

	return {
		isSupported,
		notifications,
		notify,
		permission,
		requestPermission,
	};
}
