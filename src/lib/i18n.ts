import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "@/locales/en/translation.json";
import tr from "@/locales/tr/translation.json";
import de from "@/locales/de/translation.json";
import es from "@/locales/es/translation.json";
import ar from "@/locales/ar/translation.json";

type SupportedLanguage = {
  code: string;
  label: string;
  nativeName: string;
  dir?: "ltr" | "rtl";
};

export const supportedLanguages: SupportedLanguage[] = [
  { code: "en", label: "English", nativeName: "English" },
  { code: "tr", label: "Turkish", nativeName: "Türkçe" },
  { code: "de", label: "German", nativeName: "Deutsch" },
  { code: "es", label: "Spanish", nativeName: "Español" },
  { code: "ar", label: "Arabic", nativeName: "العربية", dir: "rtl" }
];

export const rtlLanguages = supportedLanguages
  .filter((language) => language.dir === "rtl")
  .map((language) => language.code);

const resources = {
  en: { translation: en },
  tr: { translation: tr },
  de: { translation: de },
  es: { translation: es },
  ar: { translation: ar }
} as const;

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: "en",
      supportedLngs: supportedLanguages.map((language) => language.code),
      interpolation: {
        escapeValue: false
      },
      detection: {
        order: ["localStorage", "navigator", "htmlTag"],
        caches: ["localStorage"],
        lookupLocalStorage: "car-compare-language",
        convertDetectedLanguage: (lng) => lng?.split("-")[0]
      }
    });
}

export const getLanguageDirection = (language?: string) =>
  rtlLanguages.includes(language || i18n.language) ? "rtl" : "ltr";

export default i18n;
