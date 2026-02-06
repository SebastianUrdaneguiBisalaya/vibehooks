import * as React from 'react';

declare global {
	interface BarcodeDetectorOptions {
		formats?: string[];
	}

	interface DetectorBarcode {
		boundingBox?: DOMRectReadOnly;
		format: string;
		rawValue: string;
	}

	class BarcodeDetector {
		constructor(options?: BarcodeDetectorOptions);
		static getSupportedFormats(): string[];
		detect(
			image: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement
		): Promise<DetectorBarcode[]>;
	}
}

export interface UseBarcodeReturn {
	/**
	 * Raw value of the barcode.
	 */
	current: DetectorBarcode | null;

	/**
	 * A function to start the scanning process.
	 */
	start: () => Promise<void>;

	/**
	 * A function to stop the scanning process.
	 */
	stop: () => void;

	/**
	 * Whether the browser supports BarcodeDetector API.
	 */
	supported: boolean;
}

export interface UseBarcodeOptions {
	/**
	 * Optional element to scan: video, image or canvas.
	 */
	elementRef?: React.RefObject<
		HTMLVideoElement | HTMLImageElement | HTMLCanvasElement | null
	>;

	/**
	 * Optional formats to detect (default includes most common formats).
	 */
	formats?: string[];

	/**
	 * Optional callback to be called when a barcode is detected.
	 */
	onDetect?: (barcode: DetectorBarcode) => void;
}

/**
 * `useBarcode` is a hook to detect barcodes using the browser's BarcodeDetector API.
 * Automatically handles camera permissions, stream cleanup, and updates the last detected barcode.
 *
 * @example
 * ```tsx
 * const videoRef = useRef<HTMLVideoElement>(null);
 * const { rawValue, supported } = useBarcode({ elementRef: videoRef });
 *
 * if (!supported) return <p>Barcode detection not supported</p>;
 *
 * return (
 *   <div>
 *     <video ref={videoRef} autoPlay />
 *     {rawValue && <p>Last barcode: {rawValue.rawValue}</p>}
 *   </div>
 * );
 * ```
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Barcode_Detection_API
 */
export function useBarcode({
	elementRef,
	formats = [
		'aztec',
		'code_128',
		'code_39',
		'code_93',
		'codabar',
		'data_matrix',
		'ean_13',
		'ean_8',
		'itf',
		'pdf417',
		'qr_code',
		'upc_a',
		'upc_e',
		'unknown',
	],
	onDetect,
}: UseBarcodeOptions = {}): UseBarcodeReturn {
	const [current, setCurrent] = React.useState<DetectorBarcode | null>(null);
	const [supported, setSupported] = React.useState<boolean>(false);

	const lastEmittedRef = React.useRef<string | null>(null);
	const animationRef = React.useRef<number | null>(null);
	const streamRef = React.useRef<MediaStream | null>(null);
	const detectorRef = React.useRef<BarcodeDetector | null>(null);
	const runningRef = React.useRef<boolean>(false);

	React.useEffect(() => {
		if (typeof window === 'undefined' || !('BarcodeDetector' in window)) {
			setSupported(false);
			return;
		}
		setSupported(true);
		detectorRef.current = new BarcodeDetector({ formats });
	}, [formats]);

	const emitDetected = React.useCallback(
		(barcode: DetectorBarcode) => {
			const key = `${barcode.format}-${barcode.rawValue}`;
			if (lastEmittedRef.current === key) return;
			lastEmittedRef.current = key;
			setCurrent(barcode);
			onDetect?.(barcode);
		},
		[onDetect]
	);

	const scanOnce = React.useCallback(
		async (el: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement) => {
			if (!detectorRef.current) return;
			try {
				const barcodes = await detectorRef.current.detect(el);
				if (barcodes.length > 0 && barcodes[0]) {
					emitDetected(barcodes[0]);
				} else {
					lastEmittedRef.current = null;
					setCurrent(null);
				}
			} catch (error: unknown) {
				console.warn('useBarcode: barcode detection failed.', error);
			}
		},
		[emitDetected]
	);

	const scanLoop = React.useCallback(
		async (video: HTMLVideoElement) => {
			if (!runningRef.current) return;
			if (video.videoWidth === 0) {
				animationRef.current = requestAnimationFrame(() => scanLoop(video));
				return;
			}
			await scanOnce(video);
			animationRef.current = requestAnimationFrame(() => scanLoop(video));
		},
		[scanOnce]
	);

	const start = React.useCallback(async () => {
		if (!supported) return;
		if (!elementRef?.current) return;
		if (runningRef.current) return;

		const el = elementRef.current;
		runningRef.current = true;

		if (el instanceof HTMLVideoElement) {
			try {
				streamRef.current = await navigator.mediaDevices.getUserMedia({
					video: { facingMode: 'environment' },
				});
				el.srcObject = streamRef.current;
				el.setAttribute('playsinline', 'true');
				await el.play();
				scanLoop(el);
			} catch (error: unknown) {
				runningRef.current = false;
				console.warn('useBarcode: camera access denied or unavailable.', error);
			}
			return;
		}

		if (el instanceof HTMLImageElement || el instanceof HTMLCanvasElement) {
			await scanOnce(el);
			runningRef.current = false;
			return;
		}
		runningRef.current = false;
	}, [elementRef, scanLoop, scanOnce, supported]);

	const stop = React.useCallback(() => {
		runningRef.current = false;
		if (animationRef.current !== null) {
			cancelAnimationFrame(animationRef.current);
			animationRef.current = null;
		}
		if (streamRef.current) {
			streamRef.current.getTracks().forEach(track => track.stop());
			streamRef.current = null;
		}
		lastEmittedRef.current = null;
		setCurrent(null);
	}, []);

	React.useEffect(() => {
		return () => stop();
	}, []);

	return {
		current,
		start,
		stop,
		supported,
	};
}
