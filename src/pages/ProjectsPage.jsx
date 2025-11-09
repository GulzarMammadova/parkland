import { useState, useMemo } from "react";
import ProjectCard from "../components/ProjectCard";
import { PROJECTS } from "../data/projects";
import "../styles/projects.css";

export default function ProjectsPage() {
  const STEP = 4; // сколько проектов добавлять за один клик
  const [visibleCount, setVisibleCount] = useState(STEP);

  const visible = useMemo(() => PROJECTS.slice(0, visibleCount), [visibleCount]);

  const handleViewMore = () => {
    setVisibleCount((prev) => Math.min(prev + STEP, PROJECTS.length));
  };

  const isAllVisible = visibleCount >= PROJECTS.length;

  return (
    <main className="pl-wrap">
      <section className="pl-hero">
        <h1 className="pl-hero__title">Featured Projects</h1>
        <p className="pl-hero__subtitle">
          Discover our portfolio of transformative landscape designs that blend
          luxury with nature’s inherent beauty.
        </p>
      </section>

      <section className="pl-grid">
        {visible.map((p) => (
          <ProjectCard key={p.id} img={p.img} tag={p.tag} title={p.title} />
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
