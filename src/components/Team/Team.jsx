import React, { useRef, useState } from "react";
import "./Team.css";
import { motion, useInView } from "motion/react";
import { useLang } from "../../context/LanguageContext";

function ImageWithFallback({ src, alt, ...rest }) {
  const [err, setErr] = useState(false);
  const initials = (alt||"").split(" ").map(w=>w[0]||"").join("").toUpperCase().slice(0,2);
  if (err) return <div className="team__fallback" {...rest}>{initials}</div>;
  return <img src={src} alt={alt} onError={()=>setErr(true)} {...rest} />;
}

export function Team(){
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, amount:0.2 });
  const { lang } = useLang();

  const copy = {
    EN:{ title:"Our Team", sub:"Meet the passionate professionals dedicated to transforming your outdoor spaces." },
    AZ:{ title:"Komandamız", sub:"Açıq məkanlarınızı dəyişməyə həsr olunmuş peşəkarlarla tanış olun." }
  };

  const founders = [
    { name:"Aysel Mammadova", roleEN:"Co-Founder & Lead Designer", roleAZ:"Həm-təsisçi və Baş dizayner",
      image:"https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&w=1200&q=80" },
    { name:"Eldar Aliyev", roleEN:"Co-Founder & Landscape Architect", roleAZ:"Həm-təsisçi və Landşaft memarı",
      image:"https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&w=1200&q=80" },
  ];
  const team = [
    { name:"Nigar Hasanova", roleEN:"Senior Designer", roleAZ:"Baş dizayner",
      image:"https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&w=1200&q=80" },
    { name:"Rashad Ismayilov", roleEN:"Project Manager", roleAZ:"Layihə meneceri",
      image:"https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&w=1200&q=80" },
    { name:"Leyla Ahmadova", roleEN:"Horticulture Specialist", roleAZ:"Bitki mütəxəssisi",
      image:"https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&w=1200&q=80" },
    { name:"Farid Huseynov", roleEN:"Installation Coordinator", roleAZ:"Quraşdırma koordinatoru",
      image:"https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&w=1200&q=80" },
  ];

  return (
    <section id="team" className="team section" ref={ref}>
      <div className="container">
        <motion.div initial={{opacity:0,y:30}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:.8}} className="team__header">
          <h2 className="team__title">{copy[lang].title}</h2>
          <p className="team__sub">{copy[lang].sub}</p>
        </motion.div>

        <div className="team__grid team__grid--founders">
          {founders.map((f,i)=>(
            <motion.div key={f.name} initial={{opacity:0,x:-50}} animate={inView?{opacity:1,x:0}:{}} transition={{duration:.6,delay:i*.15}} className="tCard"
              onMouseEnter={(e)=> e.currentTarget.querySelector("img")?.classList.add("is-zoom")}
              onMouseLeave={(e)=> e.currentTarget.querySelector("img")?.classList.remove("is-zoom")}
            >
              <div className="tCard__photo">
                <ImageWithFallback className="tCard__img" src={f.image} alt={f.name}/>
              </div>
              <h3 className="tCard__name">{f.name}</h3>
              <p className="tCard__role tCard__role--gold">{lang==="EN"?f.roleEN:f.roleAZ}</p>
            </motion.div>
          ))}
        </div>

        <div className="team__grid">
          {team.map((m,i)=>(
            <motion.div key={m.name} initial={{opacity:0,x:-50}} animate={inView?{opacity:1,x:0}:{}} transition={{duration:.6,delay:.3+i*.15}} className="tCard"
              onMouseEnter={(e)=> e.currentTarget.querySelector("img")?.classList.add("is-zoom")}
              onMouseLeave={(e)=> e.currentTarget.querySelector("img")?.classList.remove("is-zoom")}
            >
              <div className="tCard__photo">
                <ImageWithFallback className="tCard__img" src={m.image} alt={m.name}/>
              </div>
              <h4 className="tCard__name">{m.name}</h4>
              <p className="tCard__role">{lang==="EN"?m.roleEN:m.roleAZ}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
