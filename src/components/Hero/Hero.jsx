import React, { useState } from "react";
import "./Hero.css";
import { motion } from "motion/react";
import { useLang } from "../../context/LanguageContext";
import { supabase } from "../../lib/supabaseClient";

// однажды получаем public URL — это синхронно, без запроса к сети
const BUCKET = "projects";
const HERO_WEBP = supabase.storage
  .from(BUCKET)
  .getPublicUrl("hero/hero.webp").data.publicUrl;

const HERO_JPG = supabase.storage
  .from(BUCKET)
  .getPublicUrl("hero/hero.jpg").data.publicUrl;

function ImageWithFallback({ src, alt, className, onLoad }) {
  const [err, setErr] = useState(false);
  return (
    <img
      src={
        err
          ? "https://images.unsplash.com/photo-1594737625785-caf0f13b1c52?q=80&w=1200&auto=format&fit=crop"
          : src
      }
      alt={alt}
      className={className}
      onError={() => setErr(true)}
      onLoad={onLoad}
      loading="eager"        // это наш LCP
      decoding="async"
    />
  );
}

export function Hero() {
  const { lang } = useLang();
  const [loaded, setLoaded] = useState(false);

  const copy = {
    EN: {
      title: "Creating Harmony Between Nature and Design",
      sub: "ParkLand transforms outdoor spaces into luxurious sanctuaries where elegance meets the natural world.",
      cta: "See Our Projects",
    },
    AZ: {
      title: "Təbiət və dizayn arasında harmoniya yaradırıq",
      sub: "ParkLand açıq məkanları zərifliklə təbiətin qovuşduğu lüks sığınacaqlara çevirir.",
      cta: "Layihələrimiz",
    },
  };

  return (
    <section id="hero" className="hero">
      <div className="hero__bg">
        <picture>
          {/* сначала пытаемся загрузить WebP из Supabase */}
          <source srcSet={HERO_WEBP} type="image/webp" />
          {/* fallback на jpg + blur-up */}
          <ImageWithFallback
            src={HERO_JPG}
            alt="Luxury garden"
            className={`hero__img ${loaded ? "is-loaded" : ""}`}
            onLoad={() => setLoaded(true)}
          />
        </picture>
        <div className="hero__overlay" />
      </div>

      <div className="hero__content container">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hero__title"
        >
          {copy[lang].title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="hero__sub"
        >
          {copy[lang].sub}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <a className="hero__btn" href="#portfolio">
            <span>{copy[lang].cta}</span>
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="hero__scroll"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="hero__mouse"
        >
          <div className="hero__wheel" />
        </motion.div>
      </motion.div>
    </section>
  );
}

export default Hero;
