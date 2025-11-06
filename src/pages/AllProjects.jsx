import React from "react";
import "./AllProjects.css";
import { useLang } from "../context/LanguageContext";

/** 51 карточка с предсказуемыми изображениями (заменишь на реальные) */
const PROJECTS = Array.from({ length: 51 }, (_, i) => ({
  id: i + 1,
  title: `Project ${i + 1}`,
  image: `https://picsum.photos/seed/parkland-${i + 1}/1200/900`,
}));

/** Паттерн размеров карточек: s (обычная), wide (широкая), tall (высокая), big (крупная) */
const PATTERN = ["wide","s","s","tall","s","wide","s","tall","big","s","s","tall"];

export default function AllProjects() {
  const { lang } = useLang();
  const texts = {
    EN: { title: "All Projects", caption: (t) => t },
    AZ: { title: "Bütün Layihələr", caption: (t) => t },
    RU: { title: "Все проекты", caption: (t) => t },
  };
  const t = texts[lang] || texts.EN;

  return (
    <section className="allproj section">
      <div className="container">
        <header className="allproj__head">
          <h1 className="allproj__title">{t.title}</h1>
        </header>

        <div className="allproj__grid allproj__grid--mosaic">
          {PROJECTS.map((p, i) => {
            const kind = PATTERN[i % PATTERN.length]; // повторяем паттерн
            return (
              <article key={p.id} className={`card card--${kind}`}>
                <div className="card__imgWrap">
                  <img
                    className="card__img"
                    src={p.image}
                    alt={t.caption(p.title)}
                    loading="lazy"
                  />
                  <div className="card__overlay" />
                  <div className="card__label">{t.caption(p.title)}</div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
