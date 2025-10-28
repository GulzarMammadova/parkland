import React, { useRef, useState } from "react";
import "./Services.css";
import { motion, useInView } from "motion/react";
import { useLang } from "../../context/LanguageContext";

function ImageWithFallback({ src, alt, ...rest }) {
  const [err, setErr] = useState(false);
  return <img src={err? "https://images.unsplash.com/photo-1612143241883-35889d1d65ab?auto=format&w=1200&q=80" : src} alt={alt} onError={()=>setErr(true)} {...rest} />;
}

export function Services(){
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, amount:0.2 });
  const { lang } = useLang();

  const titles = {
    EN:{ h2:"Our Services", items:["Landscape Design","Garden Installation","Water Features","Sustainable Landscaping","Outdoor Living Spaces","Maintenance & Care","Landscape Lighting","Hardscape Design"] },
    AZ:{ h2:"Xidmətlərimiz", items:["Landşaft Dizaynı","Bağların Qurulması","Su Kompozisiyaları","Davamlı Landşaft","Açıq Məkanda Yaşayış Zonaları","Baxım və Qulluq","Landşaft İşıqlandırması","Sərt Landşaft Dizaynı"] },
  };

  const images = [
    "https://images.unsplash.com/photo-1740517367497-30d198dc79f6?auto=format&w=1200&q=80",
    "https://images.unsplash.com/photo-1624358164948-e8007c2bcbe1?auto=format&w=1200&q=80",
    "https://images.unsplash.com/photo-1660920011024-ede379384182?auto=format&w=1200&q=80",
    "https://images.unsplash.com/photo-1624295885769-570803a3c650?auto=format&w=1200&q=80",
    "https://images.unsplash.com/photo-1715090576114-c07384af2069?auto=format&w=1200&q=80",
    "https://images.unsplash.com/photo-1724556295135-ff92b9aa0a55?auto=format&w=1200&q=80",
    "https://images.unsplash.com/photo-1612143241883-35889d1d65ab?auto=format&w=1200&q=80",
    "https://images.unsplash.com/photo-1642833465562-f81525657851?auto=format&w=1200&q=80",
  ];

  return (
    <section id="services" className="services section" ref={ref}>
      <div className="container">
        <motion.div initial={{opacity:0,y:30}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:.8}} className="services__header">
          <h2 className="services__title">{titles[lang].h2}</h2>
        </motion.div>

        <div className="services__grid">
          {images.map((img,i)=>(
            <motion.div key={i} initial={{opacity:0,y:30}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:.6,delay:i*.1}} className="serviceCard"
              onMouseEnter={(e)=> e.currentTarget.querySelector("img").style.transform="scale(1.1)"}
              onMouseLeave={(e)=> e.currentTarget.querySelector("img").style.transform="scale(1)"}
            >
              <ImageWithFallback className="serviceCard__img" src={img} alt={titles[lang].items[i]}/>
              <div className="serviceCard__overlay"></div>
              <h3 className="serviceCard__title">{titles[lang].items[i]}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
