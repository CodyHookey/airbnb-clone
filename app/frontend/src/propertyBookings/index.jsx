import React from "react";
import { createRoot } from "react-dom/client";
import PropertyBookings from "./propertyBookings";

document.addEventListener("DOMContentLoaded", () => {
  const node = document.getElementById("params");
  const data = JSON.parse(node.getAttribute("data-params"));

  let container = document.getElementById("root");
  if (!container) {
    container = document.createElement("div");
    container.id = "root";
    document.body.appendChild(container);
  }

  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <PropertyBookings property_id={data.property_id} />
    </React.StrictMode>
  );
});
