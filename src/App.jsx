import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Header } from "./components/Header/Header";
import { Footer } from "./components/Footer/Footer";
import { ScrollToTop } from "./components/ScrollToTop";
import { AnimatePresence } from "motion/react";
import { PageFade } from "./components/PageFade";
import AllProjects from "./pages/AllProjects";
import GalleryAdmin from "./components/GalleryAdmin";

// 🔹 БЕЗ lazy — обычные импорты
import { Hero } from "./components/Hero/Hero";
import { About } from "./components/About/About";
import { Services } from "./components/Services/Services";
import { Team } from "./components/Team/Team";
import { Portfolio } from "./components/Portfolio/Portfolio";

function AppRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageFade>
              <Hero />
              <About />
              <Services />
              <Team />
              <Portfolio />
            </PageFade>
          }
        />
        <Route
          path="/projects"
          element={
            <PageFade>
              <AllProjects />
            </PageFade>
          }
        />
        <Route
          path="/admin/media"
          element={
            <PageFade>
              <GalleryAdmin />
            </PageFade>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <>
      <Header />
      {/* всё грузится вместе, без Suspense */}
      <ScrollToTop />
      <AppRoutes />
      <Footer />
    </>
  );
}
