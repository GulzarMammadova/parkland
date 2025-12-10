import React from "react";
import { Header } from "./components/Header/Header";
import { Footer } from "./components/Footer/Footer";
import { ScrollToTop } from "./components/ScrollToTop";
import { AppRoutes } from "./routes/AppRoutes";

export default function App() {
  return (
    <>
      <Header />
      <ScrollToTop />
      <AppRoutes />
      <Footer />
    </>
  );
}
