import React from "react";
import "./Footer.css";
import { useLang } from "../../context/LanguageContext";
import { Phone, Mail, Instagram } from "lucide-react";

export function Footer(){
  const { lang } = useLang();
  const copy = {
    EN:{ contact:"Contact", blurb:"Creating harmony between nature and design through luxury landscape architecture.", rights:"All rights reserved." },
    AZ:{ contact:"Əlaqə", blurb:"Lüks landşaft memarlığı ilə təbiət və dizayn arasında harmoniya yaradırıq.", rights:"Bütün hüquqlar qorunur." }
  };
  const year = new Date().getFullYear();

  return (
    <footer className="ftr">
      <div className="container">
        <div className="ftr__grid">
          <div>
            <h3 className="ftr__brand"> <img className="hdr__brand-logo"src="../../../public/img/Parkland_logo.png" alt=""/></h3>
            <p className="ftr__text">{copy[lang].blurb}</p>
          </div>
          <div>
            <h4 className="ftr__h4">{copy[lang].contact}</h4>
<a href="tel:+994125981393" className="ftr__contactItem">
  <span className="ftr__iconWrap"><Phone className="ftr__icon" /></span>
  <span className="ftr__label">+994 (12) 598-13-93</span>
</a>

<a href="mailto:info@parkland.az" className="ftr__contactItem">
  <span className="ftr__iconWrap"><Mail className="ftr__icon" /></span>
  <span className="ftr__label">info@parkland.az</span>
</a>

<a href="https://instagram.com/parkland.az" target="_blank" rel="noreferrer" className="ftr__contactItem">
  <span className="ftr__iconWrap"><Instagram className="ftr__icon" /></span>
  <span className="ftr__label">@parkland.az</span>
</a>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="ftr__bottom">
          © {year} ParkLand. {copy[lang].rights}
        </div>
      </div>
    </footer>
  );
}
