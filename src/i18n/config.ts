import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          reader: {
            fullscreen: 'Toggle Fullscreen',
            sound: 'Toggle Sound',
            language: 'Change Language',
            previousPage: 'Previous Page',
            nextPage: 'Next Page',
            loading: 'Loading...',
            error: {
              loadFailed: 'Failed to load PDF',
              renderFailed: 'Failed to render page'
            }
          }
        }
      },
      tr: {
        translation: {
          reader: {
            fullscreen: 'Tam Ekran',
            sound: 'Ses',
            language: 'Dil Değiştir',
            previousPage: 'Önceki Sayfa',
            nextPage: 'Sonraki Sayfa',
            loading: 'Yükleniyor...',
            error: {
              loadFailed: 'PDF yüklenemedi',
              renderFailed: 'Sayfa görüntülenemedi'
            }
          }
        }
      }
    }
  });

export default i18n;