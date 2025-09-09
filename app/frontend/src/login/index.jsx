import React from "react";
import { createRoot } from "react-dom/client";
import Login from "./login";

document.addEventListener("DOMContentLoaded", () => {
  let container = document.getElementById("root");
  if (!container) {
    container = document.createElement("div");
    container.id = "root";
    document.body.appendChild(container);
  }

  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <Login />
    </React.StrictMode>
  );
});
