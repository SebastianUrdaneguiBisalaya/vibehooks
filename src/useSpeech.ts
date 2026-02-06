import * as React from 'react';

interface SpeechRecognition extends EventTarget {
	abort(): void;
	continuous: boolean;
	interimResults: boolean;
	lang: string;
	onend: ((this: SpeechRecognition, ev: Event) => unknown) | null;
	onerror:
		| ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => unknown)
		| null;
	onresult:
		| ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => unknown)
		| null;
	start(): void;
	stop(): void;
}

interface SpeechRecognitionEvent extends Event {
	readonly resultIndex: number;
	readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
	[index: number]: SpeechRecognitionResult;
	item(index: number): SpeechRecognitionResult;
	readonly length: number;
}

interface SpeechRecognitionResult {
	[index: number]: SpeechRecognitionAlternative;
	readonly isFinal: boolean;
	item(index: number): SpeechRecognitionAlternative;
	readonly length: number;
}

interface SpeechRecognitionAlternative {
	readonly confidence: number;
	readonly transcript: string;
}

interface SpeechRecognitionErrorEvent extends Event {
	readonly error: string;
	readonly message?: string;
}

interface SpeechRecognitionConstructor {
	new (): SpeechRecognition;
}

declare global {
	interface Window {
		SpeechRecognition?: SpeechRecognitionConstructor;
		webkitSpeechRecognition?: SpeechRecognitionConstructor;
	}
}

type SpeechStatus = 'idle' | 'listening' | 'stopped' | 'unsupported' | 'error';

export interface UseSpeechOptions {
	continuous?: boolean;
	interimResults?: boolean;
	lang?: string;
}

export interface UseSpeechReturn {
	error: Error | null;
	finalTranscript: string;
	interimTranscript: string;
	reset: () => void;
	start: () => void;
	status: SpeechStatus;
	stop: () => void;
	transcript: string;
}

function isChrome(): boolean {
	if (typeof navigator === 'undefined') return false;

	const ua = navigator.userAgent;

	const isChromium = ua.includes('Chrome');
	const isEdge = ua.includes('Edg');
	const isBrave =
		// @ts-expect-error navigator.brave is a non-standard Brave-specific API
		typeof navigator.brave === 'object';

	return isChromium && !isEdge && !isBrave;
}

/**
 * `useSpeech` is a React hook that provides unopinionated access to the Speech API.
 *
 * @example
 * ```tsx
 * const speech = useSpeech({ lang: 'en-US' });
 * speech.start();
 * ```
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API
 *
 */
export function useSpeech(options: UseSpeechOptions = {}): UseSpeechReturn {
	const isClient = typeof window !== 'undefined';
	const isChromeBrowser = React.useMemo(() => isChrome(), []);

	const recognitionRef = React.useRef<SpeechRecognition | null>(null);
	const isManuallyStoppedRef = React.useRef<boolean>(false);
	const shouldRestartRef = React.useRef<boolean>(false);
	const nextStatusRef = React.useRef<SpeechStatus | null>(null);

	const [status, setStatus] = React.useState<SpeechStatus>('idle');
	const [error, setError] = React.useState<Error | null>(null);
	const [finalTranscript, setFinalTranscript] = React.useState<string>('');
	const [interimTranscript, setInterimTranscript] = React.useState<string>('');

	const initializeRecognition = React.useCallback(() => {
		if (!isClient) return;

		if (!isChromeBrowser) {
			setStatus('unsupported');
			return;
		}

		const SpeechRecognitionCtor =
			window.SpeechRecognition ?? window.webkitSpeechRecognition;

		if (!SpeechRecognitionCtor) {
			setStatus('unsupported');
			return;
		}

		const recognition = new SpeechRecognitionCtor();

		recognition.lang = options.lang ?? 'en-US';
		recognition.continuous = options.continuous ?? true;
		recognition.interimResults = options.interimResults ?? true;

		recognition.onresult = (event: SpeechRecognitionEvent) => {
			let interim = '';
			let final = '';

			for (let i = event.resultIndex; i < event.results.length; i++) {
				const result = event.results[i];
				const text = result?.[0]?.transcript ?? '';

				if (result?.isFinal) {
					final += text + ' ';
				} else {
					interim += text;
				}
			}

			if (interim) {
				setInterimTranscript(interim);
			}

			if (final) {
				setFinalTranscript(prev => prev + final);
				setInterimTranscript('');
			}
		};

		recognition.onerror = event => {
			if (isManuallyStoppedRef.current) return;

			if (event.error === 'no-speech') {
				console.warn('No se detectó voz.');
				shouldRestartRef.current = true;
				return;
			}

			if (event.error === 'aborted') {
				return;
			}

			setError(new Error(event.error));
			setStatus('error');
		};

		recognition.onend = () => {
			if (isManuallyStoppedRef.current) {
				isManuallyStoppedRef.current = false;
				setStatus(nextStatusRef.current ?? 'stopped');
				return;
			}

			if (status === 'error') return;

			if (shouldRestartRef.current) {
				try {
					recognition.start();
					setStatus('listening');
				} catch (err) {
					console.error('Error al reiniciar reconocimiento:', err);
					setError(err instanceof Error ? err : new Error('Failed to restart'));
					setStatus('error');
					shouldRestartRef.current = false;
				}
				return;
			}
			setStatus('stopped');
		};

		recognitionRef.current = recognition;
	}, [isClient, options.lang, options.continuous, options.interimResults]);

	const start = React.useCallback(() => {
		if (!recognitionRef.current) {
			initializeRecognition();
		}

		const recognition = recognitionRef.current;
		if (!recognition) return;

		try {
			isManuallyStoppedRef.current = false;
			shouldRestartRef.current = true;
			recognition.start();
			setStatus('listening');
			setError(null);
		} catch (err) {
			console.error('Error al iniciar reconocimiento:', err);
			setError(err instanceof Error ? err : new Error('Failed to start'));
			setStatus('error');
		}
	}, [initializeRecognition]);

	const stop = React.useCallback(() => {
		isManuallyStoppedRef.current = true;
		shouldRestartRef.current = false;

		if (recognitionRef.current) {
			recognitionRef.current.stop();
		}
	}, []);

	const reset = React.useCallback(() => {
		nextStatusRef.current = 'idle';
		stop();
		setFinalTranscript('');
		setInterimTranscript('');
		setError(null);
	}, [stop]);

	const transcript = React.useMemo(
		() => `${finalTranscript}${interimTranscript}`.trim(),
		[finalTranscript, interimTranscript]
	);

	React.useEffect(() => {
		initializeRecognition();

		return () => {
			isManuallyStoppedRef.current = true;
			shouldRestartRef.current = false;
			if (recognitionRef.current) {
				recognitionRef.current.stop();
				recognitionRef.current = null;
			}
		};
	}, [initializeRecognition]);

	return {
		error,
		finalTranscript: finalTranscript.trim(),
		interimTranscript,
		reset,
		start,
		status,
		stop,
		transcript,
	};
}
