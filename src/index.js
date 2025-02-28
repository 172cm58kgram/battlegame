import React from "react";
import ReactDOM from "react-dom/client";  
import { BrowserRouter } from "react-router-dom"; // ここで BrowserRouter を適用
import App from "./App";
import "./styles.css"; // スタイル適用

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);