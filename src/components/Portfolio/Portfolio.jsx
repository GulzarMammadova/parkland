import React, { useRef, useState, useEffect, useMemo } from "react";
import "./Portfolio.css";
import { motion, useInView } from "motion/react";
import { useLang } from "../../context/LanguageContext";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

/* ===========================
   Настройки
=========================== */
const BUCKET = "projects";
const ROOT_PREFIX = "portfolio";
const STEP = 4;

// Разрешённые расширения картинок
const IMG_RE = /\.(jpe?g|png|webp|avif|gif)$/i;
const isImage = (name = "") => IMG_RE.test(name);

/* ===========================
   Supabase helpers (public URL)
=========================== */
function getPublicUrl(path) {
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

async function fetchJsonFromStorage(path) {
  const url = getPublicUrl(path);
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`);
  return res.json();
}

function slugify(str = "") {
  return String(str)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function prettify(s = "") {
  const t = s.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
  return t
    .split(" ")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : ""))
    .join(" ");
}

function clientFromFileName(name = "") {
  const parts = name.split("--");
  if (parts.length <= 1) return "";

  return prettify(
    parts[1]
      .replace(/\.[^.]+$/, "") // убираем расширение
      .replace(/[_-]\d+$/, "") // убираем _1, -1 в конце
  );
}

/* ===========================
   Portfolio Component
=========================== */
export function Portfolio() {
  const ref = useRef(null);
  const expandTopRef = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const { lang } = useLang();

  const [dict, setDict] = useState({ projects: {}, clients: {} });
  const [current, setCurrent] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [visibleCount, setVisibleCount] = useState(STEP);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);

  // ✅ определяем мобилку (чтобы показывать 4 проекта)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 600px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const featuredCount = isMobile ? 4 : 2;

  const texts = {
    EN: {
      heading: "Featured Projects",
      seeAll: "VIEW MORE",
      loadMore: "SHOW MORE",
      empty: "Projects will appear here soon.",
      sub: "",
    },
    AZ: {
      heading: "Seçilmiş Layihələr",
      seeAll: "Hamısına bax",
      loadMore: "Daha çox göstər",
      empty: "Layihələr tezliklə burada görünəcək.",
      sub: "",
    },
  };
  const t = texts[lang] || texts.EN;

  /* ===== Загрузка ===== */
  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);

        // 0) Загружаем titles.json
        let titles = { projects: {}, clients: {} };
        try {
          titles = await fetchJsonFromStorage(`${ROOT_PREFIX}/titles.json`);
        } catch (e) {
          console.warn("No titles.json or failed to load:", e?.message);
        }
        if (mounted) setDict(titles);

        // 1) Получаем список папок и файлов
        const { data: entries, error } = await supabase.storage
          .from(BUCKET)
          .list(ROOT_PREFIX, {
            limit: 1000,
            sortBy: { column: "name", order: "asc" },
          });

        if (error) throw error;
        const list = entries || [];
        const folders = list.filter((e) => !e.metadata); // папки
        const rootFiles = list.filter((e) => e.metadata && isImage(e.name)); // картинки в корне

        // 2) Обрабатываем папки
        const folderProjectsRaw = await Promise.all(
          folders.map(async (entry) => {
            const folderPrefix = `${ROOT_PREFIX}/${entry.name}`;
            const { data: inner, error: innerErr } = await supabase.storage
              .from(BUCKET)
              .list(folderPrefix, {
                limit: 1000,
                sortBy: { column: "name", order: "asc" },
              });

            if (innerErr) {
              console.warn("[Storage] inner list error:", folderPrefix, innerErr);
              return null;
            }

            const files = (inner || []).filter(
              (it) => it.metadata && isImage(it.name)
            );
            if (!files.length) return null;

            files.sort((a, b) => {
              const na = parseInt(a.name, 10);
              const nb = parseInt(b.name, 10);
              if (isNaN(na) || isNaN(nb)) return a.name.localeCompare(b.name);
              return na - nb;
            });

            const slug = entry.name;
            const pRec = (titles.projects || {})[slug] || {};
            const titleEn = pRec.title?.en || prettify(slug);
            const titleAz = pRec.title?.az || titleEn;
            const createdAt = pRec.createdAt || null;

            const fileWithClient = files.find((f) => f.name.includes("--"));
            const clientEn =
              (fileWithClient ? clientFromFileName(fileWithClient.name) : "") ||
              pRec.client?.en ||
              "";
            const clientAz =
              (clientEn && titles.clients?.[clientEn]?.az) ||
              pRec.client?.az ||
              clientEn;

            const images = files.map((f) =>
              getPublicUrl(`${folderPrefix}/${f.name}`)
            );
            if (!images.length) return null;

            return {
              slug,
              titleEn,
              titleAz,
              clientEn,
              clientAz,
              images,
              createdAt,
            };
          })
        );

        const folderProjects = folderProjectsRaw.filter(Boolean);

        // 3) Файлы прямо в корне
        const singleFileProjects = rootFiles.map((e) => {
          const path = `${ROOT_PREFIX}/${e.name}`;
          const url = getPublicUrl(path);

          const base = e.name.replace(/\.[^/.]+$/, "");
          const left = base.includes("--") ? base.split("--")[0] : base.split("_")[0];
          const rawSlug = slugify(left);

          const pRec = (titles.projects || {})[rawSlug] || {};
          const titleEn = pRec.title?.en || prettify(left);
          const titleAz = pRec.title?.az || titleEn;
          const createdAt = pRec.createdAt || null;

          const clientEn = clientFromFileName(e.name) || pRec.client?.en || "";
          const clientAz =
            (clientEn && titles.clients?.[clientEn]?.az) ||
            pRec.client?.az ||
            clientEn;

          return {
            slug: rawSlug,
            titleEn,
            titleAz,
            clientEn,
            clientAz,
            images: [url],
            createdAt,
          };
        });

        const result = [...folderProjects, ...singleFileProjects];

        // сортируем: новые → старые по createdAt
        result.sort((a, b) => {
          const da = a.createdAt ? new Date(a.createdAt) : 0;
          const db = b.createdAt ? new Date(b.createdAt) : 0;
          return db - da;
        });

        if (mounted) setProjects(result);
      } catch (e) {
        console.error("Supabase load error:", e);
        if (mounted) setProjects([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const ALL = projects;
  const len = ALL.length;

  // ✅ показываем 4 на мобилке, 2 на десктопе
  const showIndexes = useMemo(() => {
    if (len === 0) return [];
    const count = Math.min(featuredCount, len);
    return Array.from({ length: count }, (_, k) => (current + k) % len);
  }, [current, len, featuredCount]);

  const prev = () => setCurrent((p) => (p - 1 + len) % len);
  const next = () => setCurrent((p) => (p + 1) % len);

  const featuredIds = new Set(showIndexes);
  const restProjects = ALL.filter((_, idx) => !featuredIds.has(idx));
  const visibleRest = expanded ? restProjects.slice(0, visibleCount) : [];
  const allShown = visibleRest.length >= restProjects.length;

  useEffect(() => {
    if (expanded && expandTopRef.current) {
      expandTopRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [expanded]);

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

        {/* ✅ стрелки показываем только если есть больше, чем featuredCount */}
        {!loading && len > featuredCount && !expanded && (
          <>
            <button
              className="portfolio__arrow portfolio__arrow--left"
              onClick={prev}
              aria-label="Previous project"
              type="button"
            >
              <ChevronLeft size={30} />
            </button>
            <button
              className="portfolio__arrow portfolio__arrow--right"
              onClick={next}
              aria-label="Next project"
              type="button"
            >
              <ChevronRight size={30} />
            </button>
          </>
        )}

        <div className="portfolio__grid">
          {loading ? (
            <>
              <div className="pCard skeleton" />
              <div className="pCard skeleton" />
            </>
          ) : (
            showIndexes.map((i) => (
              <ProjectCard
                key={`feat-${ALL[i]?.slug || i}`}
                project={ALL[i]}
                inView={inView}
                priority
                lang={lang}
              />
            ))
          )}
        </div>

        {!loading && !expanded && restProjects.length > 0 && (
          <div className="see-all-container">
            <button
              type="button"
              className="see-all-btn"
              onClick={() => setExpanded(true)}
            >
              <span>{t.seeAll}</span>
            </button>
          </div>
        )}

        {!loading && expanded && (
          <>
            <div ref={expandTopRef} aria-hidden="true" />
            <div className="portfolio__grid portfolio__grid--expanded">
              {visibleRest.map((p, idx) => (
                <div
                  key={`${p.slug || p.titleEn}-${idx}`}
                  className="pl-appear"
                  style={{ animationDelay: `${(idx % STEP) * 80}ms` }}
                >
                  <ProjectCard project={p} inView={true} lang={lang} />
                </div>
              ))}
            </div>

            {!allShown && (
              <div className="see-all-container">
                <button
                  type="button"
                  className="see-all-btn"
                  onClick={() =>
                    setVisibleCount((v) =>
                      Math.min(v + STEP, restProjects.length)
                    )
                  }
                >
                  <span>{t.loadMore}</span>
                </button>
              </div>
            )}

            {restProjects.length === 0 && (
              <p className="pl-empty" style={{ textAlign: "center", marginTop: 12 }}>
                {t.empty}
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}

/* ===========================
   Project Card
=========================== */
function ProjectCard({ project, inView, priority = false, lang }) {
  if (!project) return null;

  const title = lang === "AZ" ? project.titleAz || project.titleEn : project.titleEn;

  const imgs =
    Array.isArray(project.images) && project.images.length > 0
      ? project.images
      : [
          "https://images.unsplash.com/photo-1612143241883-35889d1d65ab?auto=format&w=1200&q=80",
        ];

  const [idx, setIdx] = useState(0);

  const onKey = (e) => {
    if (e.key === "ArrowLeft") {
      setIdx((p) => (p - 1 + imgs.length) % imgs.length);
    }
    if (e.key === "ArrowRight") {
      setIdx((p) => (p + 1) % imgs.length);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
      className="pCard"
    >
      <div className="pCard__imageWrap" tabIndex={0} onKeyDown={onKey}>
        {imgs.map((src, i) => (
          <div
            key={i}
            className={`pCard__imageStage ${i === idx ? "is-active" : ""}`}
          >
            <img
              className="pCard__image"
              src={src}
              alt={`${title} ${i + 1}`}
              loading={priority && i === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}

        <div className="pCard__bars">
          {imgs.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`pCard__bar ${i === idx ? "is-active" : ""}`}
              onClick={() => setIdx(i)}
              aria-label={`Show slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="pCard__text">
        <h3 className="pCard__title">{title || ""}</h3>
      </div>
    </motion.div>
  );
}
