import * as React from 'react';

declare global {
	interface Window {
		translator?: Translator;
	}

	interface Translator {
		translate(
			text: string,
			options: TranslatorTranslateOptions
		): Promise<string>;
		isLanguagePairSupported(
			sourceLanguage: BCP47LanguageTag | undefined,
			targetLanguage: BCP47LanguageTag
		): Promise<boolean>;
	}
}

/**
 * BCP 47 language tag.
 * Examples: "en", "en-US", "es", "es-PE", "fr", "pt-BR"
 */
export type BCP47LanguageTag = string;

export interface TranslatorTranslateOptions {
	/**
	 * Source language (BCP 47).
	 * If undefined, the browser may attempt auto-detection (if supported).
	 */
	sourceLanguage?: BCP47LanguageTag | undefined;

	/**
	 * Target language (BCP 47).
	 */
	targetLanguage: BCP47LanguageTag;

	/**
	 * Optional callback triggered after checking
	 * whether the language pair is supported.
	 */
	onLanguageSupportCheck?: (supported: boolean) => void;
}

export interface UseTranslatorReturn {
	/**
	 * Whether the Translator API is available in the current browser.
	 */
	isSupported: boolean;

	/**
	 * Whether the configured language pair is supported.
	 * Null until checked.
	 */
	isLanguagePairSupported: boolean | null;

	/**
	 * Indicates whether a translation is in progress.
	 */
	isTranslating: boolean;

	/**
	 * Last translation result.
	 */
	translation: string | null;

	/**
	 * Last error produced by the hook.
	 */
	error: Error | null;

	/**
	 * Manually checks if the language pair is supported.
	 */
	checkLanguageSupport: () => Promise<boolean>;

	/**
	 * Translates a given text using the configured languages.
	 */
	translate: (text: string) => Promise<string>;
}

type TranslatorAPI = {
	translate: (
		text: string,
		options: {
			sourceLanguage?: BCP47LanguageTag | undefined;
			targetLanguage: BCP47LanguageTag;
		}
	) => Promise<string>;
	isLanguagePairSupported: (
		sourceLanguage: BCP47LanguageTag | undefined,
		targetLanguage: BCP47LanguageTag
	) => Promise<boolean>;
};

function getTranslator(): TranslatorAPI | null {
	if (typeof window === 'undefined') return null;
	return window.translator ?? null;
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
 * @since 0.0.1
 * @version 0.0.1
 *
 */
export function useTranslator(
	options: TranslatorTranslateOptions
): UseTranslatorReturn {
	const { sourceLanguage, targetLanguage, onLanguageSupportCheck } = options;

	const translatorRef = React.useRef<TranslatorAPI | null>(null);
	const [isSupported, setIsSupported] = React.useState<boolean>(true);
	const [isLanguagePairSupported, setIsLanguagePairSupported] = React.useState<
		boolean | null
	>(null);
	const [isTranslating, setIsTranslating] = React.useState<boolean>(false);
	const [translation, setTranslation] = React.useState<string | null>(null);
	const [error, setError] = React.useState<Error | null>(null);

	React.useEffect(() => {
		const translator = getTranslator();
		if (!translator) {
			setIsSupported(false);
			setError(new Error('Translator API is not supported in this browser.'));
			return;
		}
		translatorRef.current = translator;
		setIsSupported(true);
	}, []);

	const checkLanguageSupport = React.useCallback(async (): Promise<boolean> => {
		if (!translatorRef.current) {
			const error = new Error(
				'Translator API is not supported in this browser.'
			);
			setError(error);
			throw error;
		}
		try {
			const supported = await translatorRef.current.isLanguagePairSupported(
				sourceLanguage,
				targetLanguage
			);
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

	const translate = React.useCallback(
		async (text: string): Promise<string> => {
			if (!translatorRef.current) {
				const error = new Error(
					'Translator API is not supported in this browser.'
				);
				setError(error);
				throw error;
			}
			setIsTranslating(true);
			setError(null);
			try {
				if (isLanguagePairSupported === false) {
					throw new Error('The selected language pair is not supported.');
				}
				const result = await translatorRef.current.translate(text, {
					sourceLanguage,
					targetLanguage,
				});
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
		[sourceLanguage, targetLanguage, isLanguagePairSupported]
	);

	return {
		isSupported,
		isLanguagePairSupported,
		isTranslating,
		translation,
		error,
		checkLanguageSupport,
		translate,
	};
}
