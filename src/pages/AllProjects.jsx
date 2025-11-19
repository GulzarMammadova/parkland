
import React from "react";
import "./AllProjects.css";
import { useLang } from "../context/LanguageContext.jsx";
import PortfolioGrid from "../components/PortfolioGrid.jsx";

export default function AllProjects() {
  const { lang } = useLang();

  return (
    <section className="allproj section">
      <div className="container allproj__container">
        <PortfolioGrid
          folder="portfolio" // читаем projects/portfolio/*/*
          title={lang === "AZ" ? "Layihələrimiz" : "Our Projects"}
        />
      </div>
    </section>
  );
}
