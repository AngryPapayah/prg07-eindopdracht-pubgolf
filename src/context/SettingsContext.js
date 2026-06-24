import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import translations from '../i18n/translations';

const COLORS = {
  dark: {
    background: '#1B4332',
    card: '#2D6A4F',
    cardAlt: '#245741',
    text: '#FFFFFF',
    subtext: '#95D5B2',
    primary: '#40916C',
    accent: '#D4AF37',
    border: '#40916C',
    tabBar: '#152A22',
    tabBarActive: '#D4AF37',
    tabBarInactive: '#74C69D',
    danger: '#E63946',
    success: '#52B788',
    overPar: '#E63946',
    underPar: '#52B788',
    atPar: '#D4AF37',
  },
  light: {
    background: '#F0F7F4',
    card: '#FFFFFF',
    cardAlt: '#E8F5EE',
    text: '#1B4332',
    subtext: '#40916C',
    primary: '#2D6A4F',
    accent: '#D4AF37',
    border: '#B7E4C7',
    tabBar: '#FFFFFF',
    tabBarActive: '#2D6A4F',
    tabBarInactive: '#74C69D',
    danger: '#E63946',
    success: '#2D6A4F',
    overPar: '#E63946',
    underPar: '#2D6A4F',
    atPar: '#D4AF37',
  },
};

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [theme, setTheme] = useState('dark');
  const [listView, setListView] = useState('full');
  const [language, setLanguage] = useState('nl');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.multiGet(['pg_theme', 'pg_listView', 'pg_language']).then(
      ([[, t], [, lv], [, lang]]) => {
        if (t) setTheme(t);
        if (lv) setListView(lv);
        if (lang) setLanguage(lang);
        setReady(true);
      },
    );
  }, []);

  const updateTheme = async (value) => {
    setTheme(value);
    await AsyncStorage.setItem('pg_theme', value);
  };

  const updateListView = async (value) => {
    setListView(value);
    await AsyncStorage.setItem('pg_listView', value);
  };

  const updateLanguage = async (value) => {
    setLanguage(value);
    await AsyncStorage.setItem('pg_language', value);
  };

  const t = translations[language] || translations.nl;
  const colors = COLORS[theme];

  return (
    <SettingsContext.Provider
      value={{ theme, colors, listView, language, t, ready, updateTheme, updateListView, updateLanguage }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
