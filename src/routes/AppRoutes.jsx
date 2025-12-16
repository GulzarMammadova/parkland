import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";

import { PageFade } from "../components/PageFade";
import AllProjects from "../pages/AllProjects";
import GalleryAdmin from "../components/GalleryAdmin";
import { Hero } from "../components/Hero/Hero";
import { About } from "../components/About/About";
import { Services } from "../components/Services/Services";
import { Team } from "../components/Team/Team";
import { Portfolio } from "../components/Portfolio/Portfolio";

export function AppRoutes() {
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
              <Portfolio />
              <Team />
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
