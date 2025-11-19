import React, { useEffect, useMemo, useState } from "react";
import { listFilesDeep, getPublicUrl } from "../lib/storage";
import { img } from "../utils/img";
import { useLang } from "../context/LanguageContext";
import "./PortfolioGrid.css";

export default function PortfolioGrid({ folder = "portfolio", title }) {
  const { lang } = useLang();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setErr(""); setLoading(true);

        // читаем projects/portfolio/<project-slug>/*
        const rows = await listFilesDeep(folder, 2);
        // берем только изображения
        const images = rows.filter(r => /\.(jpe?g|png|webp|avif)$/i.test(r.name));

        // Собираем карточки: путь, url, Название проекта (из имени папки), Клиент (из имени файла через "--")
        const data = images.map(r => {
          const path = r.__path;                 // полный путь "portfolio/<project>/<file>"
          const url = getPublicUrl(path);
          const { project, client } = parseFromPath(path);
          return { path, url, project, client, name: r.name };
        });

        if (mounted) setItems(data);
      } catch (e) {
        if (mounted) setErr(e?.message || "Failed to load images");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [folder]);

  const thumbs = useMemo(
    () => items.map(it => ({ ...it, thumb: img(it.url, { width: 800, quality: 78 }) })),
    [items]
  );

  const texts = {
    EN: { subtitle: "Landscape projects — harmony between nature and design", empty: "No images yet." },
    AZ: { subtitle: "Landşaft layihələri — təbiət və dizaynın harmoniyası",  empty: "Hələ şəkil yoxdur." },
  };
  const t = texts[lang] || texts.EN;

  return (
    <section className="pl-section">
      <div className="pl-header">
        <h2 className="pl-title">{title}</h2>
        <p className="pl-sub">{t.subtitle}</p>
      </div>

      {err && (
        <div style={{maxWidth:1100,margin:"0 auto 12px",padding:"10px 12px",
          border:"1px solid #ffeeba",background:"#fff3cd",borderRadius:12,color:"#8a6d3b"}}>
          ⚠️ {err}
        </div>
      )}

      {loading ? (
        <div className="pl-grid">
          {Array.from({ length: 8 }).map((_, i) => <div className="pl-card skeleton" key={i} />)}
        </div>
      ) : items.length ? (
        <div className="pl-grid">
          {thumbs.map((it) => (
            <figure className="pl-card" key={it.path} onClick={() => setActive(it.url)}>
              <img src={it.thumb} alt={it.project} className="pl-img" loading="lazy" />
              <figcaption className="pl-caption">
                {/* 👇 клиент (верхняя строка). если нет — просто не показывается */}
                {it.client && <div className="pl-client">{it.client}</div>}
                {/* 👇 название проекта (нижняя строка) */}
                <div className="pl-name">{it.project}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <div style={{textAlign:"center",marginTop:40,background:"#fff",color:"#444",
          borderRadius:12,padding:"20px 24px",display:"inline-block",border:"1px solid #ddd"}}>
          {t.empty}
        </div>
      )}

      {active && (
        <div className="pl-lightbox" onClick={() => setActive(null)}>
          <button className="pl-close" aria-label="Close">×</button>
          <img
            src={img(active, { width: 2000, quality: 85, resize: "contain" })}
            alt=""
            className="pl-lightbox-img"
          />
        </div>
      )}
    </section>
  );
}

/**
 * Ожидаем путь: "portfolio/<project-slug>/<file-name>"
 * Проект = prettify(<project-slug>)
 * Клиент = из <file-name> по шаблону "Title--Client[_...].jpg"
 */
function parseFromPath(path = "") {
  const parts = path.split("/");
  const projectSlug = parts.length >= 2 ? parts[1] : "";
  const file = parts[parts.length - 1] || "";

  const project = prettify(projectSlug);

  const base = file.replace(/\.[^/.]+$/, "");
  if (base.includes("--")) {
    const after = base.split("--")[1];            // "Client[_opt]"
    const client = prettify(after.split("_")[0]);  // до первого "_"
    return { project, client };
  }
  return { project, client: "" };
}

function prettify(s = "") {
  const t = s.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
  return t.split(" ").map(w => (w ? w[0].toUpperCase() + w.slice(1) : "")).join(" ");
}
