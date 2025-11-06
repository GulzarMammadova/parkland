import React, { Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Header } from "./components/Header/Header";
import { Footer } from "./components/Footer/Footer";
import { LoadingOverlay } from "./components/LoadingOverlay";
import { ScrollToTop } from "./components/ScrollToTop";
import { AnimatePresence } from "motion/react";
import { PageFade } from "./components/PageFade";
import AllProjects from "./pages/AllProjects";

const Hero = React.lazy(() => import("./components/Hero/Hero").then(m => ({ default: m.Hero })));
const About = React.lazy(() => import("./components/About/About").then(m => ({ default: m.About })));
const Services = React.lazy(() => import("./components/Services/Services").then(m => ({ default: m.Services })));
const Team = React.lazy(() => import("./components/Team/Team").then(m => ({ default: m.Team })));
const Portfolio = React.lazy(() => import("./components/Portfolio/Portfolio").then(m => ({ default: m.Portfolio })));

export default function App() {
  const location = useLocation();

  return (
    <>
      <Header />
      <Suspense fallback={<LoadingOverlay />}>
        <ScrollToTop />

        <AnimatePresence mode="wait">
          {/* ключ обязателен для корректного exit-анима */}
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
          </Routes>
        </AnimatePresence>
      </Suspense>
      <Footer />
    </>
  );
}
