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
const ROOT_PREFIX = "portfolio";                 // внутри бакета (без начального /)
const STEP = 4;                                  // сколько проектов добавлять за клик
const SIGNED_EXPIRES_SECONDS = 60 * 60 * 24 * 365; // 1 год
const LS_KEY = "pl_signed_urls_v1";              // ключ кеша в localStorage
const LS_TTL_MS = 1000 * 60 * 60 * 6;            // TTL кеша 6 часов

/* ===========================
   localStorage cache helpers
=========================== */
function lsRead() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return { ts: 0, map: {} };
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return { ts: 0, map: {} };
    return { ts: parsed.ts || 0, map: parsed.map || {} };
  } catch {
    return { ts: 0, map: {} };
  }
}
function lsWrite(map) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify({ ts: Date.now(), map }));
  } catch {
    /* ignore quota errors */
  }
}
function isExpired(ts) {
  return Date.now() - ts > LS_TTL_MS;
}

/** Подписанный URL с кешем в localStorage */
async function getSignedUrlCached(path) {
  const cache = lsRead();
  const entry = cache.map[path];

  if (entry && !isExpired(entry.cachedAt)) return entry.url;

  const { data, error } = await supabase
    .storage
    .from(BUCKET)
    .createSignedUrl(path, SIGNED_EXPIRES_SECONDS);
  if (error) throw error;

  const url = data?.signedUrl || "";
  cache.map[path] = { url, cachedAt: Date.now() };
  lsWrite(cache.map);
  return url;
}

/** Все файлы в папке prefix → массив подписанных URL-ов (отсортирован) */
async function listSignedUrlsCached(prefix) {
  const { data: items, error } = await supabase
    .storage
    .from(BUCKET)
    .list(prefix, { limit: 1000, sortBy: { column: "name", order: "asc" } });
  if (error) throw error;

  const files = (items || []).filter((it) => /\.[A-Za-z0-9]+$/.test(it.name));

  // сортировка по числу в имени: 1.jpg, 2.jpg, 10.jpg
  files.sort((a, b) => {
    const na = parseInt(a.name, 10);
    const nb = parseInt(b.name, 10);
    if (isNaN(na) || isNaN(nb)) return a.name.localeCompare(b.name);
    return na - nb;
  });

  // параллелим генерацию подписанных ссылок
  const urls = await Promise.all(
    files.map((f) => getSignedUrlCached(`${prefix}/${f.name}`))
  );
  return urls;
}

/* ===========================
   Fallback проекты (на случай пустого Storage)
=========================== */
const DEFAULT_PROJECTS = [
  {
    title: "Modern Zen Garden",
    category: "Landscape",
    images: [
      "https://images.unsplash.com/photo-1760533536490-08a2e3470c9e?auto=format&w=1200&q=80",
      "https://images.unsplash.com/photo-1553194588-ecc5e217ebf0?auto=format&w=1200&q=80",
    ],
  },
  {
    title: "Estate Landscape",
    category: "Landscape",
    images: [
      "https://images.unsplash.com/photo-1642833465562-f81525657851?auto=format&w=1200&q=80",
      "https://images.unsplash.com/photo-1612143241883-35889d1d65ab?auto=format&w=1200&q=80",
    ],
  },
  {
    title: "Contemporary Garden",
    category: "Landscape",
    images: [
      "https://images.unsplash.com/photo-1553194588-ecc5e217ebf0?auto=format&w=1200&q=80",
      "https://images.unsplash.com/photo-1704240596554-9d1969e8ab3b?auto=format&w=1200&q=80",
    ],
  },
  {
    title: "Backyard Oasis",
    category: "Landscape",
    images: [
      "https://images.unsplash.com/photo-1659205154794-e726d5c0f517?auto=format&w=1200&q=80",
      "https://images.unsplash.com/photo-1660920011024-ede379384182?auto=format&w=1200&q=80",
    ],
  },
];

/* ===========================
   Компоненты
=========================== */
function ImageWithFallback({ src, alt, priority = false, ...rest }) {
  const [err, setErr] = useState(false);
  const attrs = priority
    ? { loading: "eager", fetchPriority: "high", decoding: "async" }
    : { loading: "lazy", fetchPriority: "auto", decoding: "async" };

  return (
    <img
      src={
        err
          ? "https://images.unsplash.com/photo-1612143241883-35889d1d65ab?auto=format&w=1200&q=80"
          : src
      }
      alt={alt}
      onError={() => setErr(true)}
      {...attrs}
      {...rest}
    />
  );
}

export function Portfolio() {
  const ref = useRef(null);
  const expandTopRef = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const { lang } = useLang();

  // верхняя витрина
  const [current, setCurrent] = useState(0);

  // нижняя секция
  const [expanded, setExpanded] = useState(false);
  const [visibleCount, setVisibleCount] = useState(STEP);

  // загрузка из Supabase
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]); // [{title, category, images: []}]

  const texts = {
    EN: {
      heading: "Featured Projects",
      sub: "Discover our portfolio of transformative landscape designs that blend luxury with nature’s inherent beauty.",
      seeAll: "VIEW MORE",
      loadMore: "SHOW MORE",
      empty: "Projects will appear here soon.",
    },
    AZ: {
      heading: "Seçilmiş Layihələr",
      sub: "Lüksü təbiətin doğma gözəlliyi ilə birləşdirən landşaфт layihələrimizi kəşf edin.",
      seeAll: "Hamısına bax",
      loadMore: "Daha çox göstər",
      empty: "Layihələr tezliklə burada görünəcək.",
    },
  };
  const t = texts[lang] || texts.EN;

  /* ===== Загрузка из Supabase Storage с кешем ===== */
/* ===== Загрузка из Supabase Storage с кешем ===== */
useEffect(() => {
  let mounted = true;

  async function load() {
    try {
      setLoading(true);

      // 1) Получаем СОДЕРЖИМОЕ каталога "portfolio"
      const { data: entries, error } = await supabase
        .storage
        .from(BUCKET)
        .list(ROOT_PREFIX, { limit: 1000, sortBy: { column: "name", order: "asc" } });

      if (error) throw error;

      const list = entries || [];
      // DEBUG: смотри что реально пришло из бакета
      console.group("[Storage] list", `${BUCKET}/${ROOT_PREFIX}`);
      console.table(list);
      console.groupEnd();

      // В Supabase: item.metadata === null -> ПАПКА, item.metadata != null -> ФАЙЛ
      const folders = list.filter((e) => !e.metadata && !/\.[A-Za-z0-9]+$/.test(e.name));
      const rootFiles = list.filter((e) => e.metadata && /\.[A-Za-z0-9]+$/.test(e.name));

      // 2) Обрабатываем папки параллельно
      const folderProjectsRaw = await Promise.all(
        folders.map(async (entry) => {
          const folderPrefix = `${ROOT_PREFIX}/${entry.name}`;

          // Файлы внутри папки (не вызываем лишний list для определения папки)
          const { data: inner, error: innerErr } = await supabase
            .storage
            .from(BUCKET)
            .list(folderPrefix, { limit: 1000, sortBy: { column: "name", order: "asc" } });

          if (innerErr) {
            console.warn("[Storage] inner list error:", folderPrefix, innerErr);
            return null;
          }

          const files = (inner || []).filter((it) => it.metadata && /\.[A-Za-z0-9]+$/.test(it.name));
          if (!files.length) return null;

          // Сортируем по номеру файла: 1.jpg, 2.jpg, 10.jpg
          files.sort((a, b) => {
            const na = parseInt(a.name, 10);
            const nb = parseInt(b.name, 10);
            if (isNaN(na) || isNaN(nb)) return a.name.localeCompare(b.name);
            return na - nb;
          });

          // Подписанные URL-ы (кешируются)
          const images = await Promise.all(
            files.map((f) => getSignedUrlCached(`${folderPrefix}/${f.name}`))
          );

          if (!images.length) return null;

          return {
            title: entry.name
              .replace(/[-_]/g, " ")
              .replace(/\b\w/g, (m) => m.toUpperCase()),
            category: "Landscape",
            images,
          };
        })
      );

      const folderProjects = folderProjectsRaw.filter(Boolean);

      // 3) Файлы прямо в корне "portfolio" -> отдельные «однофото»-проекты
      const singleFileProjects = await Promise.all(
        rootFiles.map(async (e) => {
          const path = `${ROOT_PREFIX}/${e.name}`;
          const url = await getSignedUrlCached(path);
          return {
            title: e.name.replace(/\.[^.]+$/, ""),
            category: "Landscape",
            images: [url],
          };
        })
      );

      const result = [...folderProjects, ...singleFileProjects];

      // DEBUG: покажем первые 2 URL для контроля
      if (result.length) {
        console.group("[Projects] built");
        console.log("count:", result.length);
        console.log("first project:", result[0]?.title, result[0]?.images?.slice?.(0, 2));
        console.groupEnd();
      } else {
        console.warn("No projects found in Storage. Falling back to DEFAULT_PROJECTS.");
      }

      if (mounted) {
        setProjects(result.length ? result : DEFAULT_PROJECTS);
        setLoading(false);
      }
    } catch (e) {
      console.error("Supabase load error:", e);
      if (mounted) {
        setProjects(DEFAULT_PROJECTS);
        setLoading(false);
      }
    }
  }

  load();
  return () => {
    mounted = false;
  };
}, []);


  // текущий набор данных
  const ALL = projects;
  const len = ALL.length;

  // витрина 1–2 карточки
  const showIndexes = useMemo(
    () => (len <= 1 ? [0] : [current % len, (current + 1) % len]),
    [current, len]
  );
  const prev = () => setCurrent((p) => (p - 1 + len) % len);
  const next = () => setCurrent((p) => (p + 1) % len);

  // нижняя секция — все, кроме витрины
  const featuredIds = new Set(showIndexes);
  const restProjects = ALL.filter((_, idx) => !featuredIds.has(idx));
  const visibleRest = expanded ? restProjects.slice(0, visibleCount) : [];
  const allShown = visibleRest.length >= restProjects.length;

  useEffect(() => {
    if (expanded && expandTopRef.current) {
      expandTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [expanded]);

  return (
    <section id="portfolio" className="portfolio section" ref={ref}>
      <div className="container portfolio__container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="portfolio__header"
        >
          <h2 className="portfolio__title">{t.heading}</h2>
          <p className="portfolio__sub">{t.sub}</p>
        </motion.div>

        {/* Стрелки */}
{/* Стрелки — показываем только если не раскрыт блок View More */}
{!loading && len > 1 && !expanded && (
  <>
    <button
      className="portfolio__arrow portfolio__arrow--left"
      onClick={prev}
      onMouseDown={(e) => e.preventDefault()}   // ← добавили
      aria-label="Previous project"
      type="button"
    >
      <ChevronLeft size={30} />
    </button>
    <button
      className="portfolio__arrow portfolio__arrow--right"
      onClick={next}
      onMouseDown={(e) => e.preventDefault()}   // ← добавили
      aria-label="Next project"
      type="button"
    >
      <ChevronRight size={30} />
    </button>
  </>
)}


        {/* Витрина */}
        <div className="portfolio__grid">
          {loading ? (
            <>
              <div className="pCard skeleton" />
              <div className="pCard skeleton" />
            </>
          ) : (
            showIndexes.map((i) => (
              <ProjectCard key={`feat-${i}`} project={ALL[i]} inView={inView} priority />
            ))
          )}
        </div>

        {/* Кнопка «раскрыть» */}
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

        {/* Нижняя секция */}
        {!loading && expanded && (
          <>
            <div ref={expandTopRef} aria-hidden="true" />
            <div className="portfolio__grid portfolio__grid--expanded">
              {visibleRest.map((p, idx) => (
                <div
                  key={`${p.title}-${idx}`}
                  className="pl-appear"
                  style={{ animationDelay: `${(idx % STEP) * 80}ms` }}
                >
                  <ProjectCard project={p} inView={true} />
                </div>
              ))}
            </div>

            {!allShown && (
              <div className="see-all-container">
                <button
                  type="button"
                  className="see-all-btn"
                  onClick={() =>
                    setVisibleCount((v) => Math.min(v + STEP, restProjects.length))
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

function ProjectCard({ project, inView, priority = false }) {
  if (!project) return null;

  const imgs = Array.isArray(project.images) && project.images.length > 0
    ? project.images
    : ["https://images.unsplash.com/photo-1612143241883-35889d1d65ab?auto=format&w=1200&q=80"];

  const [idx, setIdx] = useState(0);

  // Больше никаких setInterval — только ручное управление
  const onKey = (e) => {
    if (e.key === "ArrowLeft") setIdx((p) => (p - 1 + imgs.length) % imgs.length);
    if (e.key === "ArrowRight") setIdx((p) => (p + 1) % imgs.length);
  };
  
  return (
    <motion.div
      layout                // мягкая стабилизация layout без «скачков»
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
      className="pCard"
    >
      <div
        className="pCard__imageWrap"
        tabIndex={0}
        onKeyDown={onKey}
        aria-label="Project gallery"
      >
        {imgs.map((src, i) => (
          <div key={i} className={`pCard__imageStage ${i === idx ? "is-active" : ""}`}>
            <ImageWithFallback
              className="pCard__image"
              src={src}
              alt={`${project.title || "Project"} ${i + 1}`}
              priority={priority && i === 0}
            />
          </div>
        ))}
        <div className="pCard__overlay" />
      </div>

      <div className="pCard__text">
        <p className="pCard__cat">{project.category || ""}</p>
        <h3 className="pCard__title">{project.title || ""}</h3>
      </div>

      {/* ручные «полоски» слева сверху */}
      <div className="pCard__bars" role="tablist" aria-label="Gallery controls">
        {imgs.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`pCard__bar ${i === idx ? "is-active" : ""}`}
            aria-label={`Show image ${i + 1}`}
            aria-pressed={i === idx}
            onClick={() => setIdx(i)}
          />
        ))}
      </div>
    </motion.div>
  );
}