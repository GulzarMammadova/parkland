import React, { useRef, useState } from "react";
import "./Services.css";
import { motion, useInView } from "motion/react";
import { useLang } from "../../context/LanguageContext";

// Фоллбек если вдруг изображение не загружено
function ImageWithFallback({ src, alt, ...rest }) {
  const [err, setErr] = useState(false);
  return (
    <img
      src={err ? "/img/fallback.jpg" : src}
      alt={alt}
      onError={() => setErr(true)}
      {...rest}
    />
  );
}

export function Services() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const { lang } = useLang();

  const titles = {
    EN: {
      h2: "Our Services",
      items: [
        "Landscape Design ",
        "Hardscape (concrete, stone, asphalt works)",
        "Softscape (lawn, tree, shrubs, flowers)",
        "MEP (infrastructure, electrical, lighting, irrigation)",
        "Outside furniture and metal works",
        "Fito works",
      ],
    },
    AZ: {
      h2: "Xidmətlərimiz",
      items: [
        "Landşaft Dizaynı",
        "Hardscape işləri (beton, daş, asfalt)",
        "Softscape işləri (qazon, ağac, kol, gül)",
        "MEP – İnfrastruktur, elektrik, işıqlandırma və suvarma sistemləri",
        "Çöl mebelləri və metal konstruksiya işləri",
        "Fito işləri",
      ],
    },
  };

  const images = [
    "/img/services/Landscape Design.jpg",
    "/img/services/Hardscape.jpg",
    "/img/services/Softscape.avif",
    "/img/services/MEP.avif",
    "/img/services/Outside furniture and metal works.jpg",
    "/img/services/Fito works.jpg",
  ];

  return (
    <section id="services" className="services section" ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="services__header"
        >
          <h2 className="services__title">{titles[lang].h2}</h2>
        </motion.div>

        <div className="services__grid">
          {images.map((img, i) => (
            <motion.div
              key={i}
              className="serviceCard"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <ImageWithFallback
                className="serviceCard__img"
                src={img}
                alt={titles[lang].items[i]}
              />
              <h3 className="serviceCard__title">
                {titles[lang].items[i]}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
