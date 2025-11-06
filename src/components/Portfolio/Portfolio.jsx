import React, { useRef, useState, useEffect } from "react";
import "./Portfolio.css";
import { motion, useInView } from "motion/react";
import { useLang } from "../../context/LanguageContext";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

function ImageWithFallback({ src, alt, ...rest }) {
  const [err, setErr] = useState(false);
  return (
    <img
      src={
        err
          ? "https://images.unsplash.com/photo-1612143241883-35889d1d65ab?auto=format&w=1200&q=80"
          : src
      }
      alt={alt}
      onError={() => setErr(true)}
      {...rest}
    />
  );
}

const DEFAULT_PROJECTS = [
  {
    title: "Modern Zen Garden",
    category: "Residential",
    images: [
      "https://images.unsplash.com/photo-1760533536490-08a2e3470c9e?auto=format&w=1200&q=80",
      "https://images.unsplash.com/photo-1553194588-ecc5e217ebf0?auto=format&w=1200&q=80",
      "https://images.unsplash.com/photo-1734313230900-1991e75ccc3b?auto=format&w=1200&q=80",
    ],
  },
  {
    title: "Estate Landscape",
    category: "Luxury Residential",
    images: [
      "https://images.unsplash.com/photo-1642833465562-f81525657851?auto=format&w=1200&q=80",
      "https://images.unsplash.com/photo-1612143241883-35889d1d65ab?auto=format&w=1200&q=80",
      "https://images.unsplash.com/photo-1723438095835-220f5a82bed4?auto=format&w=1200&q=80",
    ],
  },
  {
    title: "Contemporary Garden",
    category: "Urban Design",
    images: [
      "https://images.unsplash.com/photo-1553194588-ecc5e217ebf0?auto=format&w=1200&q=80",
      "https://images.unsplash.com/photo-1704240596554-9d1969e8ab3b?auto=format&w=1200&q=80",
      "https://images.unsplash.com/photo-1740517367497-30d198dc79f6?auto=format&w=1200&q=80",
    ],
  },
  {
    title: "Backyard Oasis",
    category: "Residential Retreat",
    images: [
      "https://images.unsplash.com/photo-1659205154794-e726d5c0f517?auto=format&w=1200&q=80",
      "https://images.unsplash.com/photo-1715090576114-c07384af2069?auto=format&w=1200&q=80",
      "https://images.unsplash.com/photo-1660920011024-ede379384182?auto=format&w=1200&q=80",
    ],
  },
];

export function Portfolio() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const [current, setCurrent] = useState(0);
  const { lang } = useLang();

  const texts = {
    EN: {
      heading: "Featured Projects",
      sub: "Discover our portfolio of transformative landscape designs that blend luxury with nature’s inherent beauty.",
      seeAll: "VIEW MORE",
    },
    AZ: {
      heading: "Seçilmiş Layihələr",
      sub: "Lüksü təbiətin doğma gözəlliyi ilə birləşdirən landşaft layihələrimizi kəşf edin.",
      seeAll: "Hamısına bax",
    },
  };

  const t = texts[lang] || texts.EN;

  const projects = DEFAULT_PROJECTS;
  const len = projects.length;
  const showIndexes = len <= 1 ? [0] : [current % len, (current + 1) % len];

  const prev = () => setCurrent((p) => (p - 1 + len) % len);
  const next = () => setCurrent((p) => (p + 1) % len);

  return (
    <section id="portfolio" className="portfolio section" ref={ref}>
      <div className="container portfolio__container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="portfolio__header"
        >
          <h2 className="portfolio__title">{t.heading}</h2>
          <p className="portfolio__sub">{t.sub}</p>
        </motion.div>

        {len > 1 && (
          <>
            <button
              className="portfolio__arrow portfolio__arrow--left"
              onClick={prev}
              aria-label="Previous project"
            >
              <ChevronLeft size={30} />
            </button>
            <button
              className="portfolio__arrow portfolio__arrow--right"
              onClick={next}
              aria-label="Next project"
            >
              <ChevronRight size={30} />
            </button>
          </>
        )}

        <div className="portfolio__grid">
          {showIndexes.map((i) => (
            <ProjectCard key={i} project={projects[i]} inView={inView} />
          ))}
        </div>

<div className="see-all-container">
  <Link to="/projects" className="see-all-btn">
    <span>{t.seeAll}</span>
  </Link>
</div>

      </div>
    </section>
  );
}

function ProjectCard({ project, inView }) {
  if (!project) return null;
  const imgs =
    Array.isArray(project.images) && project.images.length > 0
      ? project.images
      : [
          "https://images.unsplash.com/photo-1612143241883-35889d1d65ab?auto=format&w=1200&q=80",
        ];

  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (imgs.length <= 1) return;
    const t = setInterval(() => setIdx((p) => (p + 1) % imgs.length), 3000);
    return () => clearInterval(t);
  }, [imgs.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="pCard"
    >
      <div className="pCard__imageWrap">
        {imgs.map((src, i) => (
          <div
            key={i}
            className={`pCard__imageStage ${i === idx ? "is-active" : ""}`}
          >
            <ImageWithFallback
              className="pCard__image"
              src={src}
              alt={`${project.title} ${i + 1}`}
            />
          </div>
        ))}
        <div className="pCard__overlay" />
      </div>

      <div className="pCard__text">
        <p className="pCard__cat">{project.category || ""}</p>
        <h3 className="pCard__title">{project.title || ""}</h3>
      </div>

      <div className="pCard__bars">
        {imgs.map((_, i) => (
          <div key={i} className={`pCard__bar ${i === idx ? "is-active" : ""}`} />
        ))}
      </div>
    </motion.div>
  );
}
