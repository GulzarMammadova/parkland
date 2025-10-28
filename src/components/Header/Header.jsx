import React, { useState } from "react";
import "./Header.css";
import { useLang } from "../../context/LanguageContext";

export function Header() {
  const [open, setOpen] = useState(false);
  const { lang, setLang } = useLang();

  const items = [
    { href:"#about",     EN:"About",      AZ:"Haqqımızda" },
    { href:"#services",  EN:"Services",   AZ:"Xidmətlər"  },
    { href:"#portfolio", EN:"Portfolio",  AZ:"Portfolio"  },
    { href:"#team",      EN:"Team",       AZ:"Komanda"    },
  ];

  return (
    <header className="hdr">
      <div className="container hdr__row">
        <div className="hdr__brand"><img className="hdr__brand-logo" src="../../../public/img/Parkland_logo.png" alt="" /></div>

        <nav className="hdr__nav">
          {items.map(l => (
            <a key={l.href} href={l.href} className="hdr__link">{l[lang]}</a>
          ))}
          <div className="hdr__lang">
            <button className={`hdr__langBtn ${lang==="EN"?"is-active":""}`} onClick={()=>setLang("EN")}>EN</button>
            <button className={`hdr__langBtn ${lang==="AZ"?"is-active":""}`} onClick={()=>setLang("AZ")}>AZ</button>
          </div>
        </nav>

        <button className="hdr__burger" onClick={()=>setOpen(v=>!v)} aria-expanded={open} aria-controls="hdr-mobile">
          {open ? "Close" : "Menu"}
        </button>
      </div>

      <div id="hdr-mobile" className={`hdr__mobile ${open?"is-open":""}`}>
        <div className="container">
          {items.map(l => (
            <a key={l.href} href={l.href} className="hdr__mobileLink">{l[lang]}</a>
          ))}
          <div className="hdr__lang hdr__lang--mobile">
            <button className={`hdr__langBtn ${lang==="EN"?"is-active":""}`} onClick={()=>setLang("EN")}>EN</button>
            <button className={`hdr__langBtn ${lang==="AZ"?"is-active":""}`} onClick={()=>setLang("AZ")}>AZ</button>
          </div>
        </div>
      </div>
    </header>
  );
}
