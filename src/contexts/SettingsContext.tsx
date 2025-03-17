
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppSettings } from '@/types';

type SettingsContextType = {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  toggleTheme: () => void;
  setLanguage: (language: 'en' | 'ru' | 'uz') => void;
};

const defaultSettings: AppSettings = {
  theme: 'light',
  language: 'en',
  notificationsEnabled: true,
  privacyMode: 'private',
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  updateSettings: () => {},
  toggleTheme: () => {},
  setLanguage: () => {},
});

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    // Load settings from localStorage if available
    const savedSettings = localStorage.getItem('app-settings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('app-settings', JSON.stringify(settings));
    
    // Apply theme
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    
    if (settings.theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(settings.theme);
    }
    
    // Set language attribute
    document.documentElement.lang = settings.language;
  }, [settings]);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const toggleTheme = () => {
    updateSettings({ 
      theme: settings.theme === 'light' ? 'dark' : 'light' 
    });
  };

  const setLanguage = (language: 'en' | 'ru' | 'uz') => {
    updateSettings({ language });
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, toggleTheme, setLanguage }}>
      {children}
    </SettingsContext.Provider>
  );
};
