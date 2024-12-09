import i18next from 'i18next';
import ru from './locales/ru.js';

const initI18n = () => {
  const i18nInstance = i18next.createInstance();
  return i18nInstance
    .init({
      lng: 'ru',
      debug: false,
      resources: { ru },
    })
    .then(() => i18nInstance);
};

export default initI18n;
