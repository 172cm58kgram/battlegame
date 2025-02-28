import React from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router } from "react-router-dom";  // 🔹 GitHub Pages対応
import App from "./App"; // `App` を別ファイルから読み込む
import "./styles.css"; // スタイル適用

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);