// src/context/LanguageContext.jsx
import React, {createContext, useContext, useEffect, useState} from "react";
const Ctx = createContext();
export const useLang = ()=>useContext(Ctx);
export function LangProvider({children}){
  const [lang, setLang] = useState(()=>localStorage.getItem("lang")||"AZ");
  useEffect(()=>{ 
    localStorage.setItem("lang", lang);
    document.documentElement.setAttribute("lang", lang.toLowerCase());
  },[lang]);
  return <Ctx.Provider value={{lang, setLang}}>{children}</Ctx.Provider>;
}
