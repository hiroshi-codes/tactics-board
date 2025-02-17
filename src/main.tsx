import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { SnackbarProvider } from "notistack";

import App from "./App";
import HalfCourt from "./HalfCourt";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SnackbarProvider autoHideDuration={1000} anchorOrigin={{ horizontal: "right", vertical: "bottom" }} />
    <BrowserRouter>
      <Routes>
        <Route path={import.meta.env.BASE_URL} element={<App />} />
        <Route path={`${import.meta.env.BASE_URL}half-court`} element={<HalfCourt />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
