import React from "react";
import { createRoot } from "react-dom/client";

const Home = () => {
  <h1>Home Page</h1>;
};

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("root");
  if (container) {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <Home />
      </React.StrictMode>
    );
  }
});
