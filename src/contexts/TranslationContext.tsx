
import React, { createContext, useContext } from 'react';
import { useSettings } from './SettingsContext';
import translations from '@/translations';

type TranslationContextType = {
  t: (key: string) => string;
};

const TranslationContext = createContext<TranslationContextType>({
  t: (key) => key,
});

export const useTranslation = () => useContext(TranslationContext);

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings } = useSettings();
  
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[settings.language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English if translation not found
        let fallback = translations.en;
        for (const fk of keys) {
          if (fallback && typeof fallback === 'object' && fk in fallback) {
            fallback = fallback[fk];
          } else {
            return key; // Return key as is if not found in English either
          }
        }
        return typeof fallback === 'string' ? fallback : key;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };
  
  return (
    <TranslationContext.Provider value={{ t }}>
      {children}
    </TranslationContext.Provider>
  );
};
