/**
 * Type definition for nested translation objects
 */
export type TranslationObject = {
	[key: string]: string | TranslationObject
}

/**
 * Type definition for translations by language
 */
export type TranslationsMap = {
	[language: string]: TranslationObject
}

/**
 * Simple storage implementation for non-browser environments
 */
class MemoryStorage {
	private store: Record<string, string> = {}

	getItem(key: string): string | null {
		return this.store[key] || null
	}

	setItem(key: string, value: string): void {
		this.store[key] = value
	}

	removeItem(key: string): void {
		delete this.store[key]
	}
}

/**
 * Interface for storage providers
 */
interface StorageProvider {
	getItem(key: string): string | null
	setItem(key: string, value: string): void
	removeItem(key: string): void
}

/**
 * Get appropriate storage mechanism
 */
const getStorage = (): StorageProvider => {
	try {
		// Check if localStorage is available
		if (typeof localStorage !== 'undefined') {
			// Test if we can actually use it
			localStorage.setItem('test', 'test')
			localStorage.removeItem('test')
			return localStorage
		}
	} catch (_e) {
		// Fallback to memory storage
	}

	return new MemoryStorage()
}

const storage: StorageProvider = getStorage()

/**
 * I18n interface that defines the internationalization module
 */
export interface I18n {
	translations: TranslationsMap
	currentLanguage: string
	t(key: string): string
	setLanguage(lang: string): void
	addTranslations(lang: string, translations: TranslationObject): void
	defaultTranslations: TranslationsMap
	init(): void
}

/** Internationalization (i18n) module. */
export const i18n: I18n = {
	/**
	 * Object containing translations for different languages.
	 */
	translations: {} as TranslationsMap,

	/**
	 * Get the current language of the application.
	 * @returns The current language code.
	 */
	get currentLanguage(): string {
		const storedLanguage = storage.getItem('currentLanguage')
		if (storedLanguage && this.translations[storedLanguage]) {
			return storedLanguage
		} else {
			storage.removeItem('currentLanguage')
			return 'en'
		}
	},

	/**
	 * Set the current language of the application.
	 * @param lang - The language code to set.
	 */
	set currentLanguage(lang: string) {
		if (this.translations[lang]) {
			storage.setItem('currentLanguage', lang)
		} else {
			storage.setItem('currentLanguage', 'en')
		}
	},

	/**
	 * Translate a key to the current language.
	 * @param key - The translation key.
	 * @returns The translated string or the key if not found.
	 */
	t(key: string): string {
		const keys = key.split('.')
		let translation: TranslationObject | undefined = this.translations[this.currentLanguage]

		for (const k of keys) {
			if (translation && typeof translation === 'object' && k in translation) {
				translation = translation[k] as TranslationObject
			} else {
				return key
			}
		}

		return String(translation)
	},

	/**
	 * Set the current language and dispatch a language change event.
	 * @param lang - The language code to set.
	 */
	setLanguage(lang: string): void {
		this.currentLanguage = lang
		if (typeof document !== 'undefined') {
			document.dispatchEvent(new CustomEvent('language-changed'))
		}
	},

	/**
	 * Add translations for a specific language.
	 * @param lang - The language code.
	 * @param translations - The translations to add.
	 */
	addTranslations(lang: string, translations: TranslationObject): void {
		this.translations[lang] = { ...this.translations[lang], ...translations }
	},

	/**
	 * Default translations for the application.
	 */
	defaultTranslations: {
		en: {
			error: 'Error',
			error_invalid_component_or_layout: 'Invalid component or layout',
			error_loading_page: 'Error loading page',
			page_not_found: 'Page Not Found',
			page_not_found_description: 'The requested page could not be found.',
		},
	} as TranslationsMap,

	/** Initialize the i18n module with default translations. */
	init(): void {
		Object.entries(this.defaultTranslations).forEach(([lang, translations]) => {
			this.addTranslations(lang, translations)
		})
	},
}

i18n.init()

/**
 * Type definition for the translation function
 */
export type TranslationFunction = (key: string) => string

/**
 * Shorthand function for translation.
 */
export const t: TranslationFunction = i18n.t.bind(i18n)
