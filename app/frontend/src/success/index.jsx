import React from "react";
import { createRoot } from "react-dom/client";
import Success from "./success";

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
      <Success
        start_date={data.start_date}
        end_date={data.end_date}
        booking_id={data.booking_id}
        property_id={data.property_id}
        user_email={data.user_email}
        user_username={data.user_username}
      />
    </React.StrictMode>
  );
});
