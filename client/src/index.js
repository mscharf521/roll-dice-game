import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import axios from "axios";

// axios.defaults.baseURL = "http://localhost:8080";
axios.defaults.baseURL =
  "https://oz2mqwm3ij.execute-api.us-east-1.amazonaws.com/";
axios.defaults.headers.post["Content-Type"] = "application/json";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
