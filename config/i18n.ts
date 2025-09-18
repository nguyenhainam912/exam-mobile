import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import enTranslation from "@/locales/en/en";
import viTranslation from "@/locales/vi/vi";

i18n
  .use(LanguageDetector) 
  .use(initReactI18next) // Liên kết với React
  .init({
    fallbackLng: "vi", 
    supportedLngs: ["en", "vi"], 
    resources: {
      vi: { translation: viTranslation },
      en: { translation: enTranslation },
    },
    ns: ["translation"], // Namespace mặc định
    defaultNS: "translation",
    interpolation: {
      escapeValue: false, 
    },
  });

export default i18n;