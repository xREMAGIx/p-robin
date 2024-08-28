import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import resourcesToBackend from "i18next-resources-to-backend";

export const fallbackLng = "en";
export const locales = [fallbackLng, "vi"] as const;
export type LocaleTypes = (typeof locales)[number];
export const defaultNS = "common";

i18n
  .use(
    resourcesToBackend(
      (language: LocaleTypes, namespace: string) =>
        import(`../locales/${language}/${namespace}.json`)
    )
  )
  .use(initReactI18next)
  .init({
    partialBundledLanguages: true,
    supportedLngs: locales,
    fallbackLng,
    lng: fallbackLng,
    fallbackNS: defaultNS,
    defaultNS,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

export default i18n;
