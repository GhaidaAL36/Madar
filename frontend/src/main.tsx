import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // ← add this
import App from "./App";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./style/globals.css";

async function prepare() {
  // if (import.meta.env.DEV) {
  //   const { worker } = await import("./mocks/browser");
  //   await worker.start({ onUnhandledRequest: "bypass" });
  // }
}
prepare().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <BrowserRouter>  {/* ← wrap App */}
        <App />
      </BrowserRouter>
    </StrictMode>
  );
});