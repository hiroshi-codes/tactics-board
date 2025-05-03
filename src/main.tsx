import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { SnackbarProvider } from "notistack";

import AllCourt from "./AllCourt";
import App from "./App";
import HalfCourt from "./HalfCourt";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SnackbarProvider autoHideDuration={3000} anchorOrigin={{ horizontal: "right", vertical: "bottom" }} />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/all-court" element={<AllCourt />} />
        <Route path="/half-court" element={<HalfCourt />} />
        <Route path="/tactics-board/" element={<App />} />
        <Route path="/tactics-board/all-court" element={<AllCourt />} />
        <Route path="/tactics-board/half-court" element={<HalfCourt />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
