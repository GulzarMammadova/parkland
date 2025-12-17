import React, { useState } from "react";
import "./Hero.css";
import { motion } from "motion/react";
import { useLang } from "../../context/LanguageContext";

function ImageWithFallback({ src, fallbackSrc, alt, className, onLoad }) {
  const [err, setErr] = useState(false);

  return (
    <img
      src={err ? fallbackSrc : src}
      alt={alt}
      className={className}
      onError={() => setErr(true)}
      onLoad={onLoad}
      loading="eager"
      fetchPriority="high"
      decoding="async"
      width="1920"
      height="1080"
    />
  );
}

export function Hero() {
  const { lang } = useLang();
  const [loaded, setLoaded] = useState(false);

  const copy = {
    EN: {
      title: "The Signature of Refined Landscape Aesthetics",
      sub: "ParkLand transforms outdoor spaces into luxurious sanctuaries where elegance meets the natural world.",
      cta: "See Our Projects",
    },
    AZ: {
      title: "Landşaftda incə zövqün dəsti-xətti",
      sub: "ParkLand açıq məkanları zərifliklə təbiətin qovuşduğu lüks sığınacaqlara çevirir.",
      cta: "Layihələrimiz",
    },
  };

  return (
    <section id="hero" className="hero">
      <div className="hero__bg">
        <picture>
          {/* MOBILE hero (лёгкий) */}
          <source
            media="(max-width: 768px)"
            srcSet="/img/hero-mobile.webp"
            type="image/webp"
          />

          {/* DESKTOP hero */}
          <source
            media="(min-width: 769px)"
            srcSet="/img/hero.webp"
            type="image/webp"
          />

          {/* JPG fallback */}
          <ImageWithFallback
            src="/img/hero.webp"
            fallbackSrc="/img/hero.jpg"
            alt="Luxury landscape design by ParkLand"
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

      {/* scroll indicator */}
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
