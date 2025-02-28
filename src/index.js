import React from "react";
import ReactDOM from "react-dom/client";  
import { HashRouter } from "react-router-dom"; // ✅ `HashRouter` はここでのみ使用
import App from "./App";
import "./styles.css"; // スタイル適用

function App() {
  return (
    <Router>
      <div>...</div>
    </Router>
  );
}