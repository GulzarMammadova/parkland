import React, { useRef, useState } from "react";
import "./Services.css";
import { motion, useInView } from "motion/react";
import { useLang } from "../../context/LanguageContext";

// Фоллбек если вдруг изображение не загружено
function ImageWithFallback({ src, alt, ...rest }) {
  const [err, setErr] = useState(false);
  return (
    <img
      src={
        err
          ? "/img/fallback.jpg"
          : src
      }
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
        "Landscape Design",
        "Garden Installation",
        "Water Features",
        "Sustainable Landscaping",
        "Outdoor Living Spaces",
        "Maintenance & Care",
        "Landscape Lighting",
        "Hardscape Design",
      ],
    },
    AZ: {
      h2: "Xidmətlərimiz",
      items: [
        "Landşaft Dizaynı",
        "Bağların Qurulması",
        "Su Kompozisiyaları",
        "Davamlı Landşaft",
        "Açıq Məkanda Yaşayış Zonaları",
        "Baxım və Qulluq",
        "Landşaft İşıqlandırması",
        "Sərt Landşaft Dizaynı",
      ],
    },
  };

  // ЛОКАЛЬНЫЕ ИЗОБРАЖЕНИЯ из /public/img/services/
  const images = [
    "/img/services/Landscape Design.jpg",
    "/img/services/Garden Installation.avif",        
    "/img/services/Water Features.avif",
    "/img/services/Sustainable Landscaping.avif",
    "/img/services/Outdoor Living Spaces.jpg",
    "/img/services/Maintenance & Care.avif",
    "/img/services/Landscape Lighting.avif",
    "/img/services/Hardscape Design.avif",
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
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="serviceCard"
              onMouseEnter={(e) =>
                (e.currentTarget.querySelector("img").style.transform =
                  "scale(1.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.querySelector("img").style.transform =
                  "scale(1)")
              }
            >
              <ImageWithFallback
                className="serviceCard__img"
                src={img}
                alt={titles[lang].items[i]}
              />
              <div className="serviceCard__overlay"></div>
              <h3 className="serviceCard__title">{titles[lang].items[i]}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
