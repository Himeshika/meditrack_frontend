import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// @ts-expect-error: TypeScript lacks global type definitions for standard CSS imports
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
    </StrictMode>
);