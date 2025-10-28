import React, { createContext, useContext, useEffect, useState } from "react";

const LanguageContext = createContext({ lang: "EN", setLang: () => {} });

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "EN");

  useEffect(() => {
    localStorage.setItem("lang", lang);
    document.documentElement.setAttribute("lang", lang === "AZ" ? "az" : "en");
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
