import * as React from 'react';

export type AudioStatus =
	| 'idle'
	| 'loading'
	| 'playing'
	| 'paused'
	| 'ended'
	| 'error';

export interface UseAudioOptions {
	loop?: boolean;
	src?: string;
	volume?: number;
}

export interface UseAudioReturn {
	audio: HTMLAudioElement | null;
	error: Error | null;
	pause: () => void;
	play: () => Promise<void>;
	status: AudioStatus;
}

/**
 * `useAudio` is a React hook that provides unopinionated access to the HTML5 Audio API.
 *
 * @example
 * ```tsx
 * const audio = useAudio({ src: '/sound.mp3' });
 * audio.play();
 * ```
 *
 * @author Sebastian Marat Urdanegui Bisalaya <https://sebastianurdanegui.com>
 *
 * @since 0.0.1
 * @version 0.0.1
 *
 */
export function useAudio(options: UseAudioOptions = {}): UseAudioReturn {
	const audioRef = React.useRef<HTMLAudioElement | null>(null);
	const mountedRef = React.useRef<boolean>(false);

	const [status, setStatus] = React.useState<AudioStatus>('idle');
	const [error, setError] = React.useState<Error | null>(null);

	const play = React.useCallback(async () => {
		if (!audioRef.current) return;
		try {
			await audioRef.current.play();
			setStatus('playing');
		} catch (error: unknown) {
			setError(error as Error);
			setStatus('error');
		}
	}, []);

	const pause = React.useCallback(() => {
		audioRef.current?.pause();
		setStatus('paused');
	}, []);

	React.useEffect(() => {
		mountedRef.current = true;
		const audio = new Audio(options.src ?? '');
		audio.loop = options.loop ?? false;
		audio.volume = options.volume ?? 1;

		audio.onended = () => mountedRef.current && setStatus('ended');
		audio.onerror = () => {
			if (!mountedRef.current) return;
			setError(new Error('Audio error'));
			setStatus('error');
		};
		audioRef.current = audio;

		return () => {
			mountedRef.current = false;
			audio.pause();
			audioRef.current = null;
		};
	}, [options.src, options.loop, options.volume]);

	return {
		audio: audioRef.current,
		error,
		pause,
		play,
		status,
	};
}
