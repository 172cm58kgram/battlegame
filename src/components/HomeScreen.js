import React, { useState , useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/HomeScreen.css";



const HomeScreen = () => {

    useEffect(() => {
        const canvas = document.getElementById("bgCanvas");
        const ctx = canvas.getContext("2d");
    
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    
        const particles = Array(100).fill().map(() => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 3,
            speedX: (Math.random() - 0.5) * 2,
            speedY: (Math.random() - 0.5) * 2
        }));
    
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "rgba(0, 204, 255, 0.7)";
            
            particles.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();
    
                p.x += p.speedX;
                p.y += p.speedY;
    
                if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
                if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
            });
    
            requestAnimationFrame(animate);
        }
    
        animate();
    }, []);

    const navigate = useNavigate();
    const [difficulty, setDifficulty] = useState(3);
    const [winningScore, setWinningScore] = useState(65); // 🎯 コインの勝利条件

    const difficultyLabels = {
        1: "イージー",
        2: "ノーマル",
        3: "ハード",
        4: "エキスパート",
        5: "マスター",
    };

    const handleStartGame = () => {
        navigate("/game", { state: { difficulty, winningScore } }); // 🎯 設定値を渡す
    };

    return (
        <div className="home-container">
            <canvas id="bgCanvas" className="background-canvas"></canvas>
            <h1>いっきのゲーム</h1>
            <h2 className="selected-difficulty">選択中: {difficultyLabels[difficulty]}</h2>

            <div className="difficulty-buttons">
                {Object.keys(difficultyLabels).map((level) => (
                    <button
                        key={level}
                        className={`difficulty-button ${parseInt(level) === difficulty ? "selected" : ""}`}
                        onClick={() => setDifficulty(parseInt(level))}
                    >
                        {difficultyLabels[level]}
                    </button>
                ))}
            </div>

            {/* 🎯 コインの勝利条件を設定するスライダー */}
            <div className="winning-score-selector">
                <label>勝利に必要なコイン: {winningScore} 枚</label>
                <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={winningScore}
                    onChange={(e) => setWinningScore(parseInt(e.target.value))}
                />
            </div>

            <button className="start-button" onClick={handleStartGame}>
                ゲームを始める
            </button>
            <button className="rules-button" onClick={() => navigate("/rules")}>
                ルール
            </button>
            <button className="stats-button" onClick={() => navigate("/statistics")}>
                戦績を見る
            </button>
        </div>
    );
};

export default HomeScreen;