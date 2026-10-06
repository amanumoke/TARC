import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';

const savedLang = typeof window !== 'undefined' ? localStorage.getItem('tarc-lang') || 'en' : 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
  },
  lng: savedLang,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

// Persist language preference
i18n.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('tarc-lang', lng);
    // Set html lang attribute for accessibility
    document.documentElement.lang = 'en';
  }
});

export default i18n;
