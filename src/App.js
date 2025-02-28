import React from "react";
import { Routes, Route } from "react-router-dom";
import HomeScreen from "./components/HomeScreen";
import GameScreen from "./components/GameScreen";
import RulesScreen from "./components/RulesScreen";
import StatisticsScreen from "./components/StatisticsScreen"; // 戦績画面のインポート

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/game" element={<GameScreen />} />
      <Route path="/rules" element={<RulesScreen />} />
      <Route path="/statistics" element={<StatisticsScreen />} />
    </Routes>
  );
}

export default App;