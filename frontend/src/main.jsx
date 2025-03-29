import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import ChatBox from "./components/ChatBox.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ChatBox />
    <App />
  </StrictMode>
);
