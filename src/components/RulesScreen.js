import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/RulesScreen.css";
import hammerGif from "../assets/gif/hammer.gif";
import jukuGif from "../assets/gif/juku.gif";

const RulesScreen = () => {
    const navigate = useNavigate();

    return (
        <div className="rules-container">
            <h1>ゲームのルール</h1>

            <div className="rules-section">
                <h2>基本ルール</h2>
                <ul>
                    <li>プレイヤーとコンピュータが100m×100mのフィールド内で移動し、コインを集める。</li>
                    <li><strong>先に 65枚のコイン</strong> を獲得したプレイヤーが勝利！</li>
                    <li>難易度は5段階あり、ホーム画面で選択可能。</li>
                    <li>アイテムを活用して有利に進めよう。</li>
                    <li>勝利条件のコイン獲得枚数は自分で設定可能。</li>
                </ul>
            </div>

            <div className="rules-section">
                <h2>アイテムの説明</h2>
                <ul>
                    <li>🔨  ハンマー ：敵プレイヤーに当てると、<strong>コイン30枚</strong> をばら撒かせる。</li>
                </ul>
                <img src={hammerGif} alt="ハンマーの使い方" className="rule-gif" />

                <ul>
                    <li>🏫 塾 ：素因数分解すると、<strong>敵のコインを全て奪える</strong>！</li>
                </ul>
                <img src={jukuGif} alt="塾の素因数分解" className="rule-gif" />
            </div>

            <div className="rules-section">
                <h2>その他のルール</h2>
                <ul>
                    <li>アイテムは一度使用すると、ランダムな位置に再配置される。</li>
                    <li>ゲーム中、画面の左上に <strong>自分のコイン数</strong>、右上に <strong>敵のコイン数</strong> が表示される。</li>
                    <li>画面上部には <strong>経過時間</strong> が表示される。</li>
                    <li>ゲーム終了時には「WINNER」または「LOSER」が表示され、再挑戦可能。</li>
                </ul>
            </div>

            <button className="back-button" onClick={() => navigate("/")}>
                ホームに戻る
            </button>
        </div>
    );
};

export default RulesScreen;