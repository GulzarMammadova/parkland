import React from "react";
import { Header } from "./components/Header/Header";
import { Hero } from "./components/Hero/Hero";
import { About } from "./components/About/About";
import { Services } from "./components/Services/Services";
import { Portfolio } from "./components/Portfolio/Portfolio";
import { Team } from "./components/Team/Team";
import { Footer } from "./components/Footer/Footer";

export default function App() {
  return (
    <div >
        <Header />
        <Hero />
        <About />
        <Services />
        <Team />
        <Portfolio />
      <Footer />
    </div>
  );
}
