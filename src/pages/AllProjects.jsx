import { useMemo, useState } from "react";
import ProjectCard from "../components/ProjectCard"; // та же карточка, что в Portfolio-стиле
import { PROJECTS } from "../data/projects";        // твои данные (массив объектов)
import "../styles/projects.css";

export default function AllProjects() {
  const STEP = 4; // сколько карточек добавлять за клик
  const [visibleCount, setVisibleCount] = useState(STEP);

  const visible = useMemo(
    () => PROJECTS.slice(0, visibleCount),
    [visibleCount]
  );

  const handleViewMore = () => {
    setVisibleCount((prev) => Math.min(prev + STEP, PROJECTS.length));
  };

  const isAllVisible = visibleCount >= PROJECTS.length;

  return (
    <main className="pl-wrap">
      <section className="pl-hero">
        <h1 className="pl-hero__title">All Projects</h1>
        <p className="pl-hero__subtitle">
          Explore our complete portfolio of premium, eco-elegant landscape designs.
        </p>
      </section>

      <section className="pl-grid">
        {visible.map((p, idx) => (
          <div
            key={p.id}
            className="pl-appear"             // анимация появления
            style={{ animationDelay: `${(idx % STEP) * 80}ms` }}
          >
            <ProjectCard img={p.img} tag={p.tag} title={p.title} />
          </div>
        ))}
      </section>

      {!isAllVisible && (
        <div className="pl-more">
          <button type="button" className="pl-btn" onClick={handleViewMore}>
            VIEW MORE
          </button>
        </div>
      )}

      {PROJECTS.length === 0 && (
        <p className="pl-empty">Projects will appear here soon.</p>
      )}
    </main>
  );
}
