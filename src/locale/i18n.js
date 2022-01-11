import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import tr from "./tr.json";

export default i18next.use(initReactI18next).init({
  lng: "en", // if you're using a language detector, do not define the lng option
  debug: true,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en: {
      translation: en,
    },
    tr: {
      translation: tr,
    },
  },
});
// initialized and ready to go!
// i18next is already initialized, because the translation resources where passed via init function
//document.getElementById('output').innerHTML = i18next.t('key');

export const changeLanguage = (lng) => {
  i18next.changeLanguage(lng);
};

export const currentLanguage = () => {
  return i18next.language;
};
