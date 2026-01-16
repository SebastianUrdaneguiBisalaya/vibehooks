import * as React from 'react';

export interface UseFileOptions {
	/**
	 * Allow selecting multiple files
	 */
	multiple?: boolean;

	/**
	 * Accepted file types (input accept attribute)
	 * Example: 'image/*', '.pdf'
	 */
	accept?: string;

	/**
	 * Whether the file input should be disabled
	 */
	disabled?: boolean;
}

export interface UseFileResult {
	/**
	 * Currently selected files.
	 */
	files: File[];

	/**
	 * Clears the selected files.
	 */
	reset: () => void;

	/**
	 * Manually sets files (useful for drag & drop).
	 */
	setFiles: (files: File[] | FileList) => void;

	/**
	 * Props to spread into an <input type="file" /> element.
	 */
	inputProps: React.InputHTMLAttributes<HTMLInputElement>;

	/**
	 * Whether at least one file is selected.
	 */
	hasFiles: boolean;
}

/**
 * `useFile` is a React hook that manages file selection and access in an unopinionated and transport-agnostic way.
 * This hook does not upload files, validate contents, or trigger side effects.
 *
 * @returns File helpers and input bindings.
 *
 * @example
 * ```tsx
 * const file = useFile({ accept: 'image/*', multiple: true });
 *
 * return (
 *   <>
 *     <input {...file.inputProps} />
 *     {file.files.map((f) => (
 *       <p key={f.name}>{f.name}</p>
 *     ))}
 *   </>
 * );
 *
 * `Use tipically with a button to trigger the file selection`
 * <input {...file.inputProps} />;
 * <button onClick={() => upload(file.files)}>
 *   Upload
 * </button>
 *
 * `Use with Drag & Drop`
 * const file = useFile({ multiple: true });
 * const onDrop = (e: React.DragEvent) => {
 *   e.preventDefault();
 * file.setFiles(e.dataTransfer.files);
 * };
 * ```
 *
 * @author Sebastian Marat Urdanegui Bisalaya <https://sebastianurdanegui.com>
 *
 * @since 0.0.1
 * @version 0.0.1
 *
 */
export function useFile(options: UseFileOptions = {}): UseFileResult {
	const { multiple = false, accept, disabled } = options;
	const [files, setInternalFiles] = React.useState<File[]>([]);

	const setFiles = React.useCallback(
		(input: File[] | FileList) => {
			const next = Array.from(input);
			setInternalFiles(multiple ? next : next.slice(0, 1));
		},
		[multiple]
	);

	const reset = React.useCallback(() => {
		setInternalFiles([]);
	}, []);

	const onChange = React.useCallback<
		React.ChangeEventHandler<HTMLInputElement>
	>(
		event => {
			if (!event.target.files) return;
			setFiles(event.target.files);
		},
		[setFiles]
	);

	const inputProps: React.InputHTMLAttributes<HTMLInputElement> = React.useMemo(
		() => ({
			type: 'file',
			accept,
			multiple,
			disabled,
			onChange,
		}),
		[accept, multiple, disabled, onChange]
	);

	return {
		files,
		reset,
		setFiles,
		inputProps,
		hasFiles: files.length > 0,
	};
}
