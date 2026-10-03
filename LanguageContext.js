import { createContext, useContext, useState } from "react";
import { DEFAULT_LANG } from "./i18n";

const LanguageContext = createContext({
  lang: DEFAULT_LANG,
  setLang: () => {},
});

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(DEFAULT_LANG);
  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
