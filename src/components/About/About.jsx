import React, { useRef, useState } from "react";
import "./About.css";
import { motion, useInView } from "motion/react";
import { Trees, Award, Users } from "lucide-react";
import { useLang } from "../../context/LanguageContext";


function ImageWithFallback({ src, alt, ...rest }) {
  const [err, setErr] = useState(false);
  return <img src={err? "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&w=1200&q=80" : src} alt={alt} onError={()=>setErr(true)} {...rest} />;
}

export function About(){
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, amount:0.3 });
  const { lang } = useLang();

  const copy = {
    EN:{ h2:"Crafting Timeless Outdoor Sanctuaries",
      p1:"For over two decades, ParkLənd has been at the forefront of luxury landscape design, transforming residential and commercial properties into breathtaking natural retreats.",
      p2:"Every project is a collaboration, blending our expertise with your vision to create landscapes that inspire, rejuvenate, and endure.",
      features:[
        { icon:Trees,  title:"Eco-Conscious Design",     desc:"Sustainable practices that honor and enhance the natural environment" },
        { icon:Award, title:"Award-Winning Excellence", desc:"Recognized for innovative landscape architecture and design mastery" },
        { icon:Users, title:"Personalized Approach",    desc:"Tailored solutions that reflect your unique vision and lifestyle" },
      ]},
    AZ:{ h2:"Zamansız açıq məkan sığınacaqları yaradırıq",
      p1:"İyirmi ildən artıqdır ki, ParkLənd lüks landşaft dizaynında ön sıralardadır, yaşayış və kommersiya məkanlarını heyranedici təbiət guşələrinə çevirir.",
      p2:"Hər layihə əməkdaşlıqdır: ekspertizamız sizin baxışınızla vəhdət təşkil edir ki, ruhlandıran və uzunömürlü məkanlar yaransın.",
      features:[
        { icon:Trees,  title:"Ekoloji yanaşma",         desc:"Təbiəti qoruyan və zənginləşdirən dayanıqlı praktikalar" },
        { icon:Award, title:"Mükafatlı ustalıq",       desc:"Yenilikçi landşaft memarlığı və dizayn ustalığı ilə tanınırıq" },
        { icon:Users, title:"Fərdiləşdirilmiş yanaşma", desc:"Sizin baxış və həyat tərzinizi əks etdirən həllər" },
      ]}
  };

  return (
    <section id="about" className="about section" ref={ref}>
      <div className="container about__grid">
        <motion.div initial={{opacity:0,x:-50}} animate={inView?{opacity:1,x:0}:{}} transition={{duration:.8}} className="about__imageWrap">
          <ImageWithFallback className="about__image" src="https://images.unsplash.com/photo-1734313230900-1991e75ccc3b?auto=format&w=1600&q=80" alt="Garden pathway"/>
          <div className="about__gradient"></div>
        </motion.div>

        <motion.div initial={{opacity:0,x:50}} animate={inView?{opacity:1,x:0}:{}} transition={{duration:.8,delay:.2}}>
          <h2 className="about__title">{copy[lang].h2}</h2>
          <p className="about__text">{copy[lang].p1}</p>
          <p className="about__text about__text--gap">{copy[lang].p2}</p>

          <div className="about__features">
            {copy[lang].features.map((f,i)=>{
              const Icon = f.icon;
              return (
                <motion.div key={f.title} initial={{opacity:0,y:20}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:.6, delay:.4+i*.1}} className="about__row">
                  <div className="about__icon"><Icon size={22} color="#BDA776"/></div>
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
