import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import es from './locales/es.json';
import en from './locales/en.json';
import fr from './locales/fr.json';
import de from './locales/de.json';

const resources = {
  es: { translation: es },
  en: { translation: en },
  fr: { translation: fr },
  de: { translation: de }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('lng') || navigator.language.split('-')[0] || 'es',
    fallbackLng: 'es',
    interpolation: { escapeValue: false }
  });

export default i18n;