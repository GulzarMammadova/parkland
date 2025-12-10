import React, { useRef, useState } from "react";
import "./About.css";
import { motion, useInView } from "motion/react";
import { Trees, Award, Users } from "lucide-react";
import { useLang } from "../../context/LanguageContext";
import aboutImg from "/img/about.jpg";


function ImageWithFallback({ src, alt, className, ...rest }) {
  const [hasError, setHasError] = useState(false);

  const fallbackSrc =
    "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&w=1200&q=80";

  return (
    <img
      src={hasError ? fallbackSrc : src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      {...rest}
    />
  );
}

export function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const { lang } = useLang();

  const copy = {
    EN: {
      //h2: "Crafting Timeless Outdoor Sanctuaries",
      p1: "“ParkLand” LLC was founded in 2007 by a team of skilled and talented professionals in landscape and design. From the very beginning, our mission has remained unchanged: to bring beauty to people’s lives and to serve nature.",
      p2: "In every new project, we unite the delicate lines of nature with the contemporary rhythm of design.",
      features: [
        {
          icon: Award,
          title: "Professional Mastery",
          desc: "A team formed by the industry’s most qualified specialists.",
        },
        {
          icon: Trees,
          title: "Harmony of Nature & Design",
          desc: "We blend nature with modern architecture.",
        },
        {
          icon: Users,
          title: "Flawless & Timely Delivery",
          desc: "Delivered with precision and the highest standards.",
        },
      ],
    },
    AZ: {
     // h2: "Zamansız açıq məkan sığınacaqları yaradırıq",
      p1: "“Parkland” MMC – landşaft vә dizayn şirkәti 2007–ci ildә, bir neçә peşәkar vә istedadlı insan tәrәfindәn yaradılıb. İlk gündәn mәqsәdimiz insanlara gözәllik bәxş edib, tәbiәtә xidmәt etmәkdir.",
      p2: "Biz, hәr yeni layihәdә tәbiәtin zәrif xәttini vә dizaynın müasir ritmini bir araya gәtiririk.",
      features: [
        {
          icon: Award,
          title: "Peşəkar Ustalıq",
          desc: "Komandamız yalnız ən güclü mütəxəssislərindən formalaşıb.",
        },
        {
          icon: Trees,
          title: "Təbiət və Dizayn Ahenqi",
          desc: "Hər layihədə təbiətin zərif xəttini müasir memarlıqla birləşdiririk.",
        },
        {
          icon: Users,
          title: "Qüsursuz və Vaxtında Təhvil",
          desc: "Layihələri dəqiq və yüksək standartlarla həyata keçiririk.",
        },
      ],
    },
  };

  return (
    <section id="about" className="about section" ref={ref}>
      <div className="container about__grid">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="about__imageWrap"
        >
          <ImageWithFallback
            className="about__image"
            src={aboutImg}
            alt="Garden pathway"
          />
          <div className="about__gradient"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="about__title">{copy[lang].h2}</h2>
          <p className="about__text">{copy[lang].p1}</p>
          <p className="about__text about__text--gap">{copy[lang].p2}</p>

          <div className="about__features">
            {copy[lang].features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
                  className="about__row"
                >
                  <div className="about__icon">
                    <Icon size={22} color="#BDA776" />
                  </div>
                  <div>
                    <h3 className="about__ft">{f.title}</h3>
                    <p className="about__fd">{f.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}