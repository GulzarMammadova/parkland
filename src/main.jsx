import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/global.css";
import { LangProvider } from "./context/LanguageContext.jsx";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
     <LangProvider>
      <App />
    </LangProvider>
  </BrowserRouter>
);