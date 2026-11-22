import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import AtrioApp from "./atrio/AtrioApp";
import "./index.css";
const Raiz = window.location.pathname.startsWith("/atrio") ? AtrioApp : App;
createRoot(document.getElementById("root")!).render(<StrictMode><Raiz /></StrictMode>);