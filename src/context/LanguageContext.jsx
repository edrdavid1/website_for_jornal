import React, { createContext, useState, useContext, useMemo, useCallback } from 'react';
import { translations } from '../constants/translations';

const LanguageContext = createContext(undefined);

export const LanguageProvider = ({ children }) => {
  // Можно инициализировать из localStorage, чтобы язык сохранялся после перезагрузки
  const [lang, setLang] = useState(() => localStorage.getItem('app_lang') || 'en');

  // Обертываем в useCallback, чтобы ссылка на функцию не менялась при каждом рендере
  const t = useCallback((key) => {
    return translations[lang]?.[key] || key;
  }, [lang]);

  // Обновление языка с сохранением в браузер
  const changeLanguage = useCallback((newLang) => {
    setLang(newLang);
    localStorage.setItem('app_lang', newLang);
  }, []);

  // Мемоизируем всё значение контекста
  const value = useMemo(() => ({
    lang,
    setLang: changeLanguage,
    t
  }), [lang, changeLanguage, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};