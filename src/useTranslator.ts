import * as React from 'react';

interface TranslatorConfig {
	sourceLanguage?: BCP47LanguageTag;
	targetLanguage: BCP47LanguageTag;
}

type TranslatorAvailability = 'available' | 'unavailable' | 'downloadable';

interface Translator {
	destroy(): void;
	readonly inputQuota: number;
	measureInputUsage(text: string): Promise<number>;
	readonly sourceLanguage: BCP47LanguageTag;
	readonly targetLanguage: BCP47LanguageTag;
	translate(text: string): Promise<string>;
	translateStreaming(text: string): ReadableStream<string>;
}

interface TranslatorConstructor {
	availability(config: TranslatorConfig): Promise<TranslatorAvailability>;
	create(config: TranslatorConfig): Promise<Translator>;
}

declare global {
	interface Window {
		Translator?: TranslatorConstructor;
	}
}

/**
 * BCP 47 language tag.
 * Examples: "en", "en-US", "es", "es-PE", "fr", "pt-BR"
 */
export type BCP47LanguageTag = string;

export interface TranslatorTranslateOptions {
	/**
	 * Optional callback triggered after checking
	 * whether the language pair is supported.
	 */
	onLanguageSupportCheck?: (supported: boolean) => void;

	/**
	 * Source language (BCP 47).
	 * If undefined, the browser may attempt auto-detection (if supported).
	 */
	sourceLanguage: BCP47LanguageTag;

	/**
	 * Target language (BCP 47).
	 */
	targetLanguage: BCP47LanguageTag;
}

export interface UseTranslatorReturn {
	/**
	 * Manually checks if the language pair is supported.
	 */
	checkLanguageSupport: () => Promise<boolean>;

	/**
	 * Last error produced by the hook.
	 */
	error: Error | null;

	/**
	 * Whether the configured language pair is supported.
	 * Null until checked.
	 */
	isLanguagePairSupported: boolean | null;

	/**
	 * Whether the Translator API is available in the current browser.
	 */
	isSupported: boolean;

	/**
	 * Indicates whether a translation is in progress.
	 */
	isTranslating: boolean;

	/**
	 * Translates a given text using the configured languages.
	 */
	translate: (text: string) => Promise<string>;

	/**
	 * Last translation result.
	 */
	translation: string | null;
}

/**
 * `useTranslator` is a React custom hook that provides a simple way to translate text using Translator API in Chrome to translate text with AI models provided in the browser.
 *
 * @example
 * ```tsx
 * const {
 *        isSupported,
 *        translate,
 *        checkLanguageSupport,
 *        isLanguagePairSupported,
 *        isTranslating,
 *        translation,
 *        error,
 *    } = useTranslator({
 *        sourceLanguage: "es",
 *        targetLanguage: "en-US",
 *        onLanguageSupportCheck: (supported) => {
 *            console.log("Language pair supported:", supported);
 *        },
 *    });
 *
 *    React.useEffect(() => {
 *    checkLanguageSupport();
 *    }, [checkLanguageSupport]);
 *
 *    const handleTranslate = async () => {
 *    await translate("Hola mundo");
 *    };
 * ```
 *
 * @author Sebastian Marat Urdanegui Bisalaya <https://sebastianurdanegui.com>
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Translator
 * @version 0.0.1
 *
 */
export function useTranslator(
	options: TranslatorTranslateOptions
): UseTranslatorReturn {
	const { onLanguageSupportCheck, sourceLanguage, targetLanguage } = options;

	const translatorRef = React.useRef<Translator | null>(null);
	const [isSupported, setIsSupported] = React.useState<boolean>(true);
	const [isLanguagePairSupported, setIsLanguagePairSupported] = React.useState<
		boolean | null
	>(null);
	const [isTranslating, setIsTranslating] = React.useState<boolean>(false);
	const [translation, setTranslation] = React.useState<string | null>(null);
	const [error, setError] = React.useState<Error | null>(null);

	React.useEffect(() => {
		if (typeof window === 'undefined' || !window.Translator) {
			setIsSupported(false);
			setError(new Error('Translator API is not supported in this browser.'));
			return;
		}
		setIsSupported(true);
	}, []);

	const checkLanguageSupport = React.useCallback(async (): Promise<boolean> => {
		if (!window.Translator) {
			const error = new Error(
				'Translator API is not supported in this browser.'
			);
			setError(error);
			throw error;
		}
		try {
			const availability = await window.Translator.availability({
				sourceLanguage,
				targetLanguage,
			});
			const supported = availability === 'available';
			setIsLanguagePairSupported(supported);
			onLanguageSupportCheck?.(supported);
			return supported;
		} catch (err: unknown) {
			const error =
				err instanceof Error
					? err
					: new Error('Failed to check language support.');
			setError(error);
			throw error;
		}
	}, [sourceLanguage, targetLanguage, onLanguageSupportCheck]);

	const ensureTranslator = React.useCallback(async () => {
		if (translatorRef.current) return translatorRef.current;
		if (!window.Translator) {
			throw new Error('Translator API is not supported in this browser.');
		}
		const translator = await window.Translator.create({
			sourceLanguage,
			targetLanguage,
		});

		translatorRef.current = translator;
		return translator;
	}, [sourceLanguage, targetLanguage]);

	const translate = React.useCallback(
		async (text: string): Promise<string> => {
			setIsTranslating(true);
			setError(null);
			try {
				if (isLanguagePairSupported === false) {
					throw new Error('The selected language pair is not supported.');
				}
				const translator = await ensureTranslator();
				const result = await translator.translate(text);
				setTranslation(result);
				return result;
			} catch (err: unknown) {
				const error =
					err instanceof Error ? err : new Error('Failed to translate text.');
				setError(error);
				throw error;
			} finally {
				setIsTranslating(false);
			}
		},
		[isLanguagePairSupported, ensureTranslator]
	);

	React.useEffect(() => {
		return () => {
			translatorRef.current?.destroy();
			translatorRef.current = null;
		};
	}, []);

	return {
		checkLanguageSupport,
		error,
		isLanguagePairSupported,
		isSupported,
		isTranslating,
		translate,
		translation,
	};
}
