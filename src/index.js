import React from "react";
import ReactDOM from "react-dom/client";  
import { HashRouter } from "react-router-dom"; // ✅ `HashRouter` はここでのみ使用
import App from "./App";
import "./styles.css"; // スタイル適用

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <HashRouter> {/* ✅ `HashRouter` は index.js でのみ適用 */}
        <App />
    </HashRouter>
);