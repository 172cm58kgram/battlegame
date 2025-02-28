import React from "react";
import { useNavigate } from "react-router-dom";

const StatisticsScreen = () => {
    const navigate = useNavigate();
    const stats = JSON.parse(localStorage.getItem("gameStats")) || { wins: 0, losses: 0, winRate: 0, bestTime: "N/A" };

    return (
        <div className="stats-container">
            <h1>戦績</h1>
            <p>勝ち数: {stats.wins}</p>
            <p>負け数: {stats.losses}</p>
            <p>勝率: {stats.winRate.toFixed(2)}%</p>
            <p>最速勝利タイム: {stats.bestTime}秒</p>
            <button onClick={() => navigate("/")}>ホームに戻る</button>
        </div>
    );
};

export default StatisticsScreen;