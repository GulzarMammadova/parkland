import React, { useEffect, useState, useRef } from "react";
import "./Team.css";
import { useLang } from "../../context/LanguageContext";
import { supabase } from "../../lib/supabaseClient";
import { motion, useInView } from "motion/react";

// ===== настройки Supabase =====
const BUCKET = "projects";
const TEAM_PREFIX = "team";

// какие файлы считаем изображениями
const IMG_RE = /\.(jpe?g|png|webp|avif|gif)$/i;
const isImage = (name = "") => IMG_RE.test(name);

/* ===== helpers ===== */

function getPublicUrl(path) {
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

async function fetchJsonFromStorage(path) {
  const url = getPublicUrl(path);
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`);
  return res.json();
}

function prettify(s = "") {
  const t = s.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
  return t
    .split(" ")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : ""))
    .join(" ");
}

function parseMemberFromFilename(fileName = "") {
  const base = fileName.replace(/\.[^.]+$/, "");
  const [left, right] = base.split("--");
  const slug = (left || "").toLowerCase();
  const nameEn = prettify(slug);
  const roleEn = right ? prettify(right) : "";
  return { slug, nameEn, roleEn };
}

/* ===== лёгкая анимация для всей сетки (дополнительно к выезду слева) ===== */
const gridVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.19, 1, 0.22, 1] },
  },
};

export function Team() {
  const { lang } = useLang();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);

        // 1) локализации из team/team.json (опционально)
        let dict = { members: {} };
        try {
          dict = await fetchJsonFromStorage(`${TEAM_PREFIX}/team.json`);
        } catch (e) {
          console.warn("No team.json or failed to load:", e?.message);
        }

        // 2) список файлов из папки "team"
        const { data: list, error } = await supabase.storage
          .from(BUCKET)
          .list(TEAM_PREFIX, {
            limit: 1000,
            sortBy: { column: "name", order: "asc" },
          });

        if (error) throw error;

        const files = (list || []).filter(
          (it) => it.metadata && isImage(it.name)
        );

        files.sort((a, b) => a.name.localeCompare(b.name));

        // 3) собираем карточки, убирая дубликаты по slug
        const out = [];
        const seen = new Set();

        for (const f of files) {
          const path = `${TEAM_PREFIX}/${f.name}`;
          const photo = getPublicUrl(path);
          const base = parseMemberFromFilename(f.name);

          if (!base.slug) continue;
          if (seen.has(base.slug)) continue;
          seen.add(base.slug);

          const mRec = dict.members?.[base.slug] || {};
          const nameAz = mRec.name?.az || base.nameEn;
          const nameEn = mRec.name?.en || base.nameEn;
          const roleAz = mRec.role?.az || base.roleEn;
          const roleEn = mRec.role?.en || base.roleEn;

          out.push({
            id: path,
            slug: base.slug,
            nameEn,
            nameAz,
            roleEn,
            roleAz,
            photo,
          });
        }

        if (mounted) setMembers(out);
      } catch (e) {
        console.error("Team load error:", e);
        if (mounted) setMembers([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const texts = {
    EN: { title: "Our Team", sub: "" },
    AZ: { title: "Komandamız", sub: "" },
  };
  const t = texts[lang] || texts.EN;

  const founders = members.filter(
    (m) =>
      (m.roleEn || "").toLowerCase().includes("founder") ||
      (m.roleAz || "").toLowerCase().includes("təsisçi")
  );
  const others = members.filter((m) => !founders.includes(m));

  const foundersGridClass =
    "team__grid team__grid--founders" +
    (founders.length === 1 ? " team__grid--founders--single" : "");

  // === наблюдаем за всей секцией, чтобы включить анимацию выезда слева ===
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section
      id="team"
      ref={sectionRef}
      className={`team section ${inView ? "team--visible" : ""}`}
    >
      <div className="container team__container">
        <div className="team__header">
          <h2 className="team__title">{t.title}</h2>
          <p className="team__sub">{t.sub}</p>
        </div>

        {loading ? (
          <div className="team__grid">
            {Array.from({ length: 5 }).map((_, i) => (
              <div className="tCard" key={i}>
                <div className="team__fallback">PL</div>
                <p className="tCard__name" style={{ opacity: 0.5 }}>
                  Loading…
                </p>
              </div>
            ))}
          </div>
        ) : (
          <>
            {founders.length > 0 && (
              <motion.div
                className={foundersGridClass}
                variants={gridVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
              >
                {founders.map((m) => {
                  const name =
                    lang === "AZ" ? m.nameAz || m.nameEn : m.nameEn;
                  const role =
                    lang === "AZ" ? m.roleAz || m.roleEn : m.roleEn;

                  const initials =
                    name &&
                    name
                      .split(" ")
                      .filter(Boolean)
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 3);

                  return (
                    <article className="tCard tCard--founder" key={m.id}>
                      <div className="tCard__photo">
                        {m.photo ? (
                          <img
                            className="tCard__img"
                            src={m.photo}
                            alt={name}
                            loading="eager"
                            decoding="async"
                          />
                        ) : (
                          <div className="team__fallback">
                            {initials || "PL"}
                          </div>
                        )}
                      </div>
                      <h3 className="tCard__name">{name}</h3>
                      <p className="tCard__role tCard__role--gold">
                        {role}
                      </p>
                    </article>
                  );
                })}
              </motion.div>
            )}

            {others.length > 0 && (
              <motion.div
                className="team__grid"
                variants={gridVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                {others.map((m) => {
                  const name =
                    lang === "AZ" ? m.nameAz || m.nameEn : m.nameEn;
                  const role =
                    lang === "AZ" ? m.roleAz || m.roleEn : m.roleEn;

                  const initials =
                    name &&
                    name
                      .split(" ")
                      .filter(Boolean)
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 3);

                  return (
                    <article className="tCard" key={m.id}>
                      <div className="tCard__photo">
                        {m.photo ? (
                          <img
                            className="tCard__img"
                            src={m.photo}
                            alt={name}
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <div className="team__fallback">
                            {initials || "PL"}
                          </div>
                        )}
                      </div>
                      <h3 className="tCard__name">{name}</h3>
                      <p className="tCard__role">{role}</p>
                    </article>
                  );
                })}
              </motion.div>
            )}

            {!others.length && !founders.length && (
              <p style={{ textAlign: "center", marginTop: 24 }}>
                Team will appear here soon.
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default Team;
