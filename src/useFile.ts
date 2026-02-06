import * as React from 'react';

export interface UseFileOptions {
	/**
	 * Accepted file types (input accept attribute)
	 * Example: 'image/*', '.pdf'
	 */
	accept?: string;

	/**
	 * Whether the file input should be disabled
	 */
	disabled?: boolean;

	/**
	 * Allow selecting multiple files
	 */
	multiple?: boolean;
}

export interface UseFileReturn {
	/**
	 * Currently selected files.
	 */
	files: File[];

	/**
	 * Whether at least one file is selected.
	 */
	hasFiles: boolean;

	/**
	 * Props to spread into an <input type="file" /> element.
	 */
	inputProps: React.InputHTMLAttributes<HTMLInputElement>;

	/**
	 * Clears the selected files.
	 */
	reset: () => void;

	/**
	 * Manually sets files (useful for drag & drop).
	 */
	setFiles: (files: File[] | FileList) => void;
}

/**
 * `useFile` is a React hook that manages file selection and access in an unopinionated and transport-agnostic way.
 * This hook does not upload files, validate contents, or trigger side effects.
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
 * @version 0.0.1
 *
 */
export function useFile(options: UseFileOptions = {}): UseFileReturn {
	const { accept, disabled, multiple = false } = options;
	const [files, setInternalFiles] = React.useState<File[]>([]);
	const inputRef = React.useRef<HTMLInputElement | null>(null);

	const setFiles = React.useCallback(
		(input: File[] | FileList) => {
			const next = Array.from(input);
			setInternalFiles(multiple ? next : next.slice(0, 1));
		},
		[multiple]
	);

	const reset = React.useCallback(() => {
		setInternalFiles([]);
		if (inputRef.current) {
			inputRef.current.value = '';
		}
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
			accept,
			disabled,
			multiple,
			onChange,
			ref: inputRef,
			type: 'file',
		}),
		[accept, multiple, disabled, onChange]
	);

	return {
		files,
		hasFiles: files.length > 0,
		inputProps,
		reset,
		setFiles,
	};
}
