import * as React from 'react';

export interface UseIndexedDBOptions {
	/**
	 * Database name
	 */
	name: string;

	/**
	 * Database version
	 */
	version: number;

	/**
	 * Option upgrade callback
	 */
	onUpgrade?: (
		db: IDBDatabase,
		oldVersion: number,
		newVersion: number | null
	) => void;
}

export interface UseIndexedDBTransactionOptions {
	mode?: IDBTransactionMode;
}

export interface UseIndexedDBTransactionResult {
	/**
	 * Opens the database connection
	 */
	open: () => Promise<IDBDatabase>;

	/**
	 * Runs a transaction and exposes the object store
	 */
	withStore: <T>(
		storeName: string,
		fn: (store: IDBObjectStore) => Promise<T>,
		options?: UseIndexedDBTransactionOptions
	) => Promise<T>;

	/**
	 * Closes the database connection
	 */
	close: () => void;

	/**
	 * Deletes the database
	 */
	deleteDatabase: () => Promise<void>;
}

/**
 * `useIndexedDB` is a React hook that provides unopinionated access to IndexedDB.
 * This hook does not manage schemas, objet stores, or data shape.
 * It only abstracts database lifecycle and transaction boilerplate.
 *
 * @returns IndexedDB helpers.
 *
 * @example
 * ```tsx
 * const db = useIndexedDB({
 *   name: 'app-db',
 *   version: 1,
 *   onUpgrade(db) {
 *     db.createObjectStore('users', { keyPath: 'id' });
 *   },
 * });
 *
 * await db.withStore('users', async (store) => {
 *   store.put({ id: '1', name: 'Sebas' });
 * });
 * ```
 *
 * @author Sebastian Marat Urdanegui Bisalaya <https://sebastianurdanegui.com>
 *
 * @since 0.0.1
 * @version 0.0.1
 *
 */
export function useIndexedDB(
	options: UseIndexedDBOptions
): UseIndexedDBTransactionResult {
	const dbRef = React.useRef<IDBDatabase | null>(null);

	const isSupported =
		typeof window !== 'undefined' && typeof window.indexedDB !== 'undefined';

	const open = React.useCallback(() => {
		if (!isSupported) {
			return Promise.reject(new Error('IndexedDB not supported.'));
		}
		if (dbRef.current) {
			return Promise.resolve(dbRef.current);
		}
		return new Promise<IDBDatabase>((resolve, reject) => {
			const request = indexedDB.open(options.name, options.version);
			request.onupgradeneeded = event => {
				options.onUpgrade?.(request.result, event.oldVersion, event.newVersion);
			};
			request.onsuccess = () => {
				dbRef.current = request.result;
				resolve(dbRef.current);
			};
			request.onerror = () => {
				reject(request.error);
			};
		});
	}, [isSupported, options]);

	const withStore = React.useCallback(
		async <T>(
			storeName: string,
			fn: (store: IDBObjectStore) => Promise<T>,
			options?: UseIndexedDBTransactionOptions
		): Promise<T> => {
			const db = await open();
			return new Promise<T>((resolve, reject) => {
				const tx = db.transaction(storeName, options?.mode ?? 'readwrite');
				const store = tx.objectStore(storeName);
				fn(store)
					.then(result => {
						tx.oncomplete = () => resolve(result);
						tx.onerror = () => reject(tx.error);
					})
					.catch(reject);
			});
		},
		[open]
	);

	const close = React.useCallback(() => {
		dbRef.current?.close();
		dbRef.current = null;
	}, []);

	const deleteDatabase = React.useCallback(() => {
		close();
		return new Promise<void>((resolve, reject) => {
			const request = indexedDB.deleteDatabase(options.name);
			request.onsuccess = () => resolve();
			request.onerror = () => reject(request.error);
		});
	}, [close, options.name]);

	return {
		open,
		withStore,
		close,
		deleteDatabase,
	};
}
