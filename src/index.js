import ReactDOM from "react-dom/client";
import { HashRouter as Router } from "react-router-dom";
import App from "./App.js";
import "./API/I18n.js";

// Styles
import "./style.css";
import "./all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primeicons/primeicons.css";

// New Way To Render The Project In React
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <App />
  </Router>
);
