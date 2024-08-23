import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App.jsx";
// Styles
import "./style.css";
import "./all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
// import "./App.css";

// New Way To Render The Project In React
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <App />
  </Router>
);
