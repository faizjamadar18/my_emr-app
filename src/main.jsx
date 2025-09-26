import React from "react";
import { createRoot } from "react-dom/client";
import EMRApp from "./App";
import "./index.css";

const root = createRoot(document.getElementById("root"));
root.render(<EMRApp />);
