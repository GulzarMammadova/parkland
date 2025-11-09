import React, { useEffect, useMemo, useState } from "react";
import { listFiles, getPublicUrl } from "../lib/storage";
import { img } from "../utils/img";
import { useLang } from "../context/LanguageContext";
import "./PortfolioGrid.css";

export default function PortfolioGrid({ folder = "", title }) {
  const { lang } = useLang();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setErr("");
        setLoading(true);

        const rows = await listFiles(folder); // folder === "" => корень
        // временный лог для проверки
        console.log("Supabase listFiles rows:", rows);

        // берём только файлы с нужными расширениями
        const images = rows.filter(r => /\.(jpe?g|png|webp|avif)$/i.test(r.name));
        const withUrls = images.map((r) => {
          const path = folder ? `${folder}/${r.name}` : r.name; // корректный путь
          const url = getPublicUrl(path);
          return {
            name: r.name,
            url,
            category: formatCategory(r.name, lang),
            title: formatTitle(r.name, lang),
          };
        });

        if (mounted) setItems(withUrls);
      } catch (e) {
        if (mounted) setErr(e?.message || "Failed to load images");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [folder, lang]);

  const thumbs = useMemo(() => {
    return items.map(it => ({
      ...it,
      thumb: img(it.url, { width: 600, quality: 75 }),
    }));
  }, [items]);

  const texts = {
    EN: {
      subtitle: "Landscape projects — harmony between nature and design",
      empty: "No images yet in the bucket 'projects' root.",
    },
    AZ: {
      subtitle: "Landşaft layihələri — təbiət və dizaynın harmoniyası",
      empty: "Hələ şəkil yoxdur: 'projects' səbətinin kökündə fayl yoxdur.",
    },
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
            <figure className="pl-card" key={it.name} onClick={() => setActive(it.url)}>
              <img src={it.thumb} alt={it.title} className="pl-img" loading="lazy" />
              <figcaption className="pl-caption">
                <div className="pl-cat">{it.category}</div>
                <div className="pl-name">{it.title}</div>
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

/* форматирование подписей */
function formatTitle(name, lang) {
  const clean = name.replace(/\.[^/.]+$/, "");
  const parts = clean.split("_");
  const raw = parts[1] ? parts[1].replace(/-/g, " ") : parts[0];
  const titles = { EN: capitalize(raw), AZ: azTranslate(raw) };
  return titles[lang] || titles.EN;
}
function formatCategory(name, lang) {
  const clean = name.replace(/\.[^/.]+$/, "");
  const parts = clean.split("_");
  const cat = parts[0]?.toLowerCase() || "landscape";
  const categories = {
    EN: { residential:"Residential", garden:"Garden", commercial:"Commercial", vertical:"Vertical Gardens", landscape:"Landscape" },
    AZ: { residential:"Yaşayış",     garden:"Bağ",    commercial:"Kommersiya", vertical:"Şaquli bağlar",     landscape:"Landşaft" },
  };
  return categories[lang]?.[cat] || categories[lang]?.landscape;
}
function capitalize(s){ return s.charAt(0).toUpperCase() + s.slice(1); }
function azTranslate(text){
  const dict = { "modern garden":"Müasir bağ", "japanese style":"Yapon üslubu", "vertical wall":"Şaquli bağ", "city park":"Şəhər parkı", "zen garden":"Zen bağı" };
  const key = (text||"").toLowerCase();
  return dict[key] || capitalize(text||"");
}
