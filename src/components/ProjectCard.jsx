import "./../styles/projects.css";

export default function ProjectCard({ img, tag, title }) {
  return (
    <article className="pl-card">
      <img className="pl-card__img" src={img} alt={title} loading="lazy" />
      <div className="pl-card__overlay" />
      <div className="pl-card__content">
        <span className="pl-card__tag">{tag}</span>
        <h3 className="pl-card__title">{title}</h3>
      </div>
    </article>
  );
}
