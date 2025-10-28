// === PARKLAND — MAIN SCRIPT ===

// --- Обновление года ---
window.addEventListener("load", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

// --- Анимация появления блока Команда ---
const teamSection = document.getElementById("team");
const members = document.querySelectorAll(".member");

if (teamSection && members.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          members.forEach((m, i) => {
            setTimeout(() => m.classList.add("visible"), i * 250);
          });
          observer.disconnect();
        }
      });
    },
    { threshold: 0.3 }
  );
  observer.observe(teamSection);
}

// --- Портфолио карусель ---
const track = document.getElementById("track");
if (track) {
  let idx = 0;
  const total = track.children.length;
  function moveCarousel(step = 1) {
    idx = (idx + step + total) % total;
    track.style.transform = `translateX(-${idx * 33.333}%)`;
  }
  const next = document.getElementById("next");
  const prev = document.getElementById("prev");
  if (next) next.onclick = () => moveCarousel(1);
  if (prev) prev.onclick = () => moveCarousel(-1);
  setInterval(() => moveCarousel(1), 4000);
}

// --- Переключатель языка (Fade + LocalStorage) ---
const azBtn = document.getElementById("az");
const enBtn = document.getElementById("en");

const translations = {
  az: {
    nav: ["Haqqımızda", "Komanda", "Xidmətlər", "Layihələr"],
    hero: "Premium & Eco-Elegant Landşaft və Dizayn Həllləri",
    mission:
      "Missiyamız gözəllik və davamlılığı birləşdirmək, təbiət və müasir dizaynın harmoniyada mövcud olduğu mühitlər yaratmaqdır. 2007-ci ildən ParkLand ictimai məkanları qayğı və innovasiya ilə formalaşdırır.",
    founders: [
      { name: "Ramil Abbasov", role: "Təsisçi & CEO" },
      { name: "Elvira Məmmədova", role: "Həmtəsisçi & Dizayner" },
    ],
    staff: [
      { name: "Kamran Əliyev", role: "Layihə Meneceri" },
      { name: "Səbinə Kərim", role: "Landşaft Memarı" },
      { name: "Vuqar İsayev", role: "Mühəndis" },
      { name: "Ləylə Quliyeva", role: "Botanik" },
    ],
    services: [
      "Landşaft dizaynı",
      "Ozalənmə və abadlıq",
      "Fitodizayn",
      "Şaquli bağlar",
    ],
    portfolio: [
      { title: "Şəhər Parkı, Bakı", client: "Sifarişçi: Dövlət qurumu" },
      { title: "Sağlamlıq Mərkəzi", client: "Sifarişçi: Dövlət xəstəxanası" },
      {
        title: "İnzibati bina, şaquli bağ",
        client: "Sifarişçi: Dövlət agentliyi",
      },
    ],
    contacts: { phone: "Telefon: ", email: "E-poçt: " },
  },

  en: {
    nav: ["About", "Team", "Services", "Projects"],
    hero: "Premium & Eco-Elegant Landscape & Design Solutions",
    mission:
      "Our mission is to bring beauty and sustainability together — creating environments where nature and modern design coexist in harmony. Since 2007, ParkLand has been shaping public spaces with care and innovation.",
    founders: [
      { name: "Ramil Abbasov", role: "Founder & CEO" },
      { name: "Elvira Mammadova", role: "Co-Founder & Designer" },
    ],
    staff: [
      { name: "Kamran Aliyev", role: "Project Manager" },
      { name: "Sabina Karim", role: "Landscape Architect" },
      { name: "Vugar Isayev", role: "Engineer" },
      { name: "Layla Guliyeva", role: "Botanist" },
    ],
    services: [
      "Landscape Design",
      "Greening & Improvement",
      "Phytodesign",
      "Vertical Gardens",
    ],
    portfolio: [
      { title: "City Park, Baku", client: "Client: Government Agency" },
      { title: "Health Center", client: "Client: State Hospital" },
      {
        title: "Administrative Building, Vertical Garden",
        client: "Client: State Agency",
      },
    ],
    contacts: { phone: "Phone: ", email: "Email: " },
  },
};

// --- Функции ---
function setText(el, txt) {
  if (el) el.textContent = txt;
}

function fadeUpdate(callback) {
  document.body.classList.add("fade");
  setTimeout(() => {
    callback();
    document.body.classList.remove("fade");
  }, 400);
}

function switchLang(lang) {
  localStorage.setItem("lang", lang);
  if (azBtn) azBtn.classList.toggle("active", lang === "az");
  if (enBtn) enBtn.classList.toggle("active", lang === "en");

  const t = translations[lang];
  if (!t) return;

  fadeUpdate(() => {
    // NAVIGATION
    const navLinks = document.querySelectorAll("header nav a");
    navLinks.forEach((el, i) => setText(el, t.nav[i]));

    // HERO
    setText(document.querySelector(".hero h1"), t.hero);

    // MISSION
    setText(document.querySelector(".mission p"), t.mission);

    // FOUNDERS
    const foundersEls = document.querySelectorAll(".founders .member");
    foundersEls.forEach((el, i) => {
      if (t.founders[i]) {
        setText(el.querySelector("h3"), t.founders[i].name);
        setText(el.querySelector("p"), t.founders[i].role);
      }
    });

    // STAFF
    const staffEls = document.querySelectorAll(".staff .member");
    staffEls.forEach((el, i) => {
      if (t.staff[i]) {
        setText(el.querySelector("h3"), t.staff[i].name);
        setText(el.querySelector("p"), t.staff[i].role);
      }
    });

    // SERVICES
    const serviceEls = document.querySelectorAll(".service span");
    serviceEls.forEach((el, i) => setText(el, t.services[i]));

    // PORTFOLIO
    const cards = document.querySelectorAll(".card");
    cards.forEach((el, i) => {
      if (t.portfolio[i]) {
        setText(el.querySelector(".meta strong"), t.portfolio[i].title);
        setText(el.querySelector(".meta span"), t.portfolio[i].client);
      }
    });

    // FOOTER CONTACTS
    const phoneLabel = document.querySelector('[data-i18n="contact-phone"]');
    const emailLabel = document.querySelector('[data-i18n="contact-email"]');
    setText(phoneLabel, t.contacts.phone);
    setText(emailLabel, t.contacts.email);
  });
}

// --- Обработчики ---
if (azBtn && enBtn) {
  azBtn.addEventListener("click", () => switchLang("az"));
  enBtn.addEventListener("click", () => switchLang("en"));
  const saved = localStorage.getItem("lang") || "az";
  switchLang(saved);
}

