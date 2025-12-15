import React, { useEffect, useState } from "react";
import "./Header.css";
import { useLang } from "../../context/LanguageContext";
import { Link, useLocation } from "react-router-dom";
import logoImg from "../../../public/img/Parkland_logo.png"

export function Header() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("about");
  const location = useLocation();

  // Скролл при переходе на /#id
  useEffect(() => {
    if (!location.hash) return;
    const id = decodeURIComponent(location.hash.slice(1));
    const el = document.getElementById(id);
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 0);
    }
  }, [location.pathname, location.hash]);

  // Активная секция (подсветка в меню)
  useEffect(() => {
    const ids = ["about", "services", "team", "portfolio"];
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (vis?.target?.id) setActive(vis.target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0.2, 0.4, 0.6] }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  // Блок скролла при открытом меню
  useEffect(() => {
    const prev = document.body.style.overflow || "";
    document.body.style.overflow = open ? "hidden" : prev;
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Авто-закрытие бургера на десктопе
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 901px)");
    const onChange = (e) => {
      if (e.matches) setOpen(false);
    };
    if (mq.matches) setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const menu = {
    EN: [
      { id: "about", label: "About" },
      { id: "services", label: "Services" },
      { id: "team", label: "Team" },
      { id: "portfolio", label: "Projects" }, // ведёт к секции portfolio
    ],
    AZ: [
      { id: "about", label: "Haqqımızda" },
      { id: "services", label: "Xidmətlər" },
      { id: "team", label: "Komanda" },
      { id: "portfolio", label: "Layihələr" },
    ],
  };

  // Формируем ссылки — ВСЕ идут на главную с якорем
  const linkTo = (id) => ({ pathname: "/", hash: `#${id}` });

  const onNavClick = () => setOpen(false);

  return (
    <header className="hdr hdr--home">
      <div className="hdr__container">
        {/* Логотип → главная */}
        <Link to="/" className="hdr__logo" aria-label="ParkLand">
          <img
            className="hdr__logo_img"
            src={logoImg}
            alt="ParkLand"
          />
        </Link>

        {/* Desktop меню */}
        <nav className="hdr__nav" aria-label="Primary">
          {menu[lang].map((item) => (
            <Link
              key={item.id}
              to={linkTo(item.id)}
              className={`hdr__link ${active === item.id ? "is-active" : ""}`}
              onClick={onNavClick}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Переключатель языка */}
        <div className="langSwitch" role="tablist" aria-label="Language">
          <button
            type="button"
            role="tab"
            aria-selected={lang === "AZ"}
            className={`langSwitch__btn ${lang === "AZ" ? "is-active" : ""}`}
            onClick={() => setLang("AZ")}
          >
            AZ
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={lang === "EN"}
            className={`langSwitch__btn ${lang === "EN" ? "is-active" : ""}`}
            onClick={() => setLang("EN")}
          >
            ENG
          </button>
        </div>

        {/* Бургер */}
        <button
          className={`hdr__burger ${open ? "is-open" : ""}`}
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Overlay + Mobile меню */}
      <div
        className={`mnav__overlay ${open ? "is-open" : ""}`}
        onClick={() => setOpen(false)}
      />
      <nav className={`mnav ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <div className="mnav__inner">
          {menu[lang].map((item) => (
            <Link
              key={item.id}
              to={linkTo(item.id)}
              className="mnav__link"
              onClick={onNavClick}
            >
              {item.label}
            </Link>
          ))}

          <div className="mnav__lang">
            <div className="langSwitch">
              <button
                className={`langSwitch__btn ${lang === "AZ" ? "is-active" : ""
                  }`}
                onClick={() => {
                  setLang("AZ");
                  setOpen(false);
                }}
              >
                AZ
              </button>
              <button
                className={`langSwitch__btn ${lang === "EN" ? "is-active" : ""
                  }`}
                onClick={() => {
                  setLang("EN");
                  setOpen(false);
                }}
              >
                ENG
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
