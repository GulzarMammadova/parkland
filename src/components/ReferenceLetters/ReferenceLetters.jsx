import React from "react";
import { GallerySection } from "./GallerySection";
import { useLang } from "../../context/LanguageContext";
import "./ReferenceLetters.css";

const translations = {
  AZ: "Tövsiyə məktubları",
  EN: "Letters of Appreciation",
};

export function ReferenceLetters() {
  const { lang, setLang } = useLang();

  return (
    <section id="recommendations" className="rl-section">
      <div className="rl-container">

        <header className="rl-header">
          <h2>{translations[lang]}</h2>
        </header>

        <GallerySection />
      </div>
    </section>
  );
}