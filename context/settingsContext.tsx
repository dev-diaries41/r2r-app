import React, { createContext, useState, useContext, ReactNode } from 'react';

interface Settings {
  theme: string;
}

interface SettingsContextProps {
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
}

const SettingsContext = createContext<SettingsContextProps | undefined>(undefined);

interface SettingsProviderProps {
  children: ReactNode;
  settings: Settings;
}

const SettingsProvider = ({ children, settings }: SettingsProviderProps) => {
  const [theme, setTheme] = useState(settings?.theme);

  return (
    <SettingsContext.Provider value={{
      theme,
      setTheme,
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

const useSettingsContext = (): SettingsContextProps => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettingsContext must be used within a SettingsProvider');
  }
  return context;
};

export { SettingsContext, SettingsProvider, useSettingsContext };
