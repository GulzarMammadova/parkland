import React from "react";
import "./Footer.css";
import { useLang } from "../../context/LanguageContext";

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
            <h3 className="ftr__brand">ParkLənd</h3>
            <p className="ftr__text">{copy[lang].blurb}</p>
          </div>
          <div>
            <h4 className="ftr__h4">{copy[lang].contact}</h4>
            <a href="tel:+994501234567" className="ftr__link">+994 (50) 123-45-67</a>
            <a href="mailto:hello@parkland.az" className="ftr__link">hello@parkland.az</a>
            <a href="https://instagram.com/parkland" target="_blank" rel="noreferrer" className="ftr__link">@parkland</a>
          </div>
        </div>
        <div className="ftr__bottom">© {year} ParkLand. {copy[lang].rights}</div>
      </div>
    </footer>
  );
}
