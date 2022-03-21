import { features } from '../flavorConfig'

export const SUPPORTED_LANGUAGES = features.localization ? ["fr", "en", "es", "it"] : ["fr"]
export const DEFAULT_LANGUAGE = "fr"
export const FALLBACK_LANGUAGE = features.localization ? ["en", "fr"] : ["fr"]

export const LANGUAGE_INFO = {
  fr: {
    label: "Français",
    labelWithoutAccent: "Francais",
    flag: "🇫🇷",
  },
  en: {
    label: "English",
    labelWithoutAccent: "English",
    flag: "🇬🇧",
  },
  es: {
    label: "Español",
    labelWithoutAccent: "Espanol",
    flag: "🇪🇸",
  },
  it: {
    label: "Italiano",
    labelWithoutAccent: "Italiano",
    flag: "🇮🇹",
  },
}
