import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import uz from './locales/uz';
import ru from './locales/ru';
import zh from './locales/zh';

const savedLang = localStorage.getItem('lang') || 'uz';

i18n.use(initReactI18next).init({
  resources: {
    uz: { translation: uz },
    ru: { translation: ru },
    zh: { translation: zh },
  },
  lng: savedLang,
  fallbackLng: 'uz',
  interpolation: { escapeValue: false },
});

export default i18n;
