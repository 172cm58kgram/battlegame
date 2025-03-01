import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/GameScreen.css";

import hammerImg from "../assets/hammer.png";
// import sakeImg from "../assets/sake.png";
// import stunGunImg from "../assets/stungun.png";
// import drinkImg from "../assets/drink.png";
import jukuImg from "../assets/juku.png";

// フィールドサイズを動的に決定（画面サイズに適応）
const FIELD_SIZE = Math.min(window.innerWidth, window.innerHeight) * 0.9;
const PLAYER_SIZE = Math.max(FIELD_SIZE * 0.02, 20);
// const FIELD_BOUNDARY = FIELD_SIZE - PLAYER_SIZE; // 枠内に完全一致
const PLAYER_SPEED = Math.max(FIELD_SIZE * 0.02, 25); // 速度を画面サイズに応じて調整
const COIN_RADIUS = PLAYER_SIZE * 0.5;
const COIN_PICKUP_RANGE = PLAYER_SIZE;
const COIN_COUNT = 115;
const ITEM_COUNT = 10;
// const WINNING_SCORE = 65;


const difficultySettings = {
  1: { speed: PLAYER_SPEED * 0.6, smartRatio: 0.6 },
  2: { speed: PLAYER_SPEED * 0.8, smartRatio: 0.7 },
  3: { speed: PLAYER_SPEED, smartRatio: 0.8 },
  4: { speed: PLAYER_SPEED * 1.2, smartRatio: 0.85 },
  5: { speed: PLAYER_SPEED * 1.5, smartRatio: 0.95 },
};

function generatePrimeFactors() {
  const primeNumbers = [2, 3, 5, 7, 11, 13, 17, 19];
  let num = 1;
  let factors = [];

  while (num < 1000) {
      const factor = primeNumbers[Math.floor(Math.random() * primeNumbers.length)];
      num *= factor;
      factors.push(factor);
      if (num >= 1000 && num < 10000) break;
  }

  factors.sort((a, b) => a - b); // 小さい順に並べる（わかりやすくする）
  return { num, factors };  // num と factors の両方を返す
}

const GameScreen = () => {


    const navigate = useNavigate();
    const location = useLocation();

    const difficulty = location.state?.difficulty || 3;
    const winningScore = location.state?.winningScore || 65; // 🎯 修正
    const enemySpeed = difficultySettings[difficulty]?.speed || PLAYER_SPEED * 0.6;
    const smartRatio = difficultySettings[difficulty]?.smartRatio || 0.5;

    const [player, setPlayer] = useState({ x: FIELD_SIZE / 2, y: FIELD_SIZE / 2 });
    const [enemy, setEnemy] = useState({ x: FIELD_SIZE * 0.25, y: FIELD_SIZE * 0.25 });
    const [coins, setCoins] = useState(generateCoins(COIN_COUNT));
    const [items, setItems] = useState(generateItems(ITEM_COUNT));
    const [playerScore, setPlayerScore] = useState(0);
    const [enemyScore, setEnemyScore] = useState(0);
    const [playerItem, setPlayerItem] = useState(null);
    const [enemyItem, setEnemyItem] = useState(null); // 敵のアイテム状態を追加
    const [gameOver, setGameOver] = useState(false);
    const [winner, setWinner] = useState(null);
    const [startTime, setStartTime] = useState(Date.now());
    // const [enemyControlRandom, setEnemyControlRandom] = useState(false);
    const [enemySpeedState, setEnemySpeed] = useState(() => difficultySettings[difficulty]?.speed || PLAYER_SPEED * 0.6);
    const [playerSpeed, setPlayerSpeed] = useState(PLAYER_SPEED);
    const [jukuProblem, setJukuProblem] = useState(null); // 現在の問題
    const [jukuAnswer, setJukuAnswer] = useState(""); // ユーザーの解答
    const [jukuFactors, setJukuFactors] = useState([]); // 必要な素因数
    const [enemyCanMove, setEnemyCanMove] = useState(true); // 敵が動けるか
    const [elapsedTime, setElapsedTime] = useState(0);


    useEffect(() => {
        if (playerScore >= winningScore || enemyScore >= winningScore) { // 🎯 修正
            setGameOver(true);
            const winner = playerScore >= winningScore ? "Player" : "Enemy"; // 🎯 修正
            setWinner(winner);
    
            // 勝利までの経過時間を計算
            const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
            updateStatistics(winner, elapsedTime);
        }
    }, [playerScore, enemyScore, winningScore]);  // 🎯 依存関係に winningScore を追加

    useEffect(() => {
        if (playerScore >= winningScore || enemyScore >= winningScore) { // 🎯 勝利条件を変更
            setGameOver(true);
            const winner = playerScore >= winningScore ? "Player" : "Enemy";
            setWinner(winner);

            // 勝利までの経過時間を計算
            const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
            updateStatistics(winner, elapsedTime);
        }
    }, [playerScore, enemyScore, winningScore]); // 🎯 winningScore を監視

    useEffect(() => {
        const interval = setInterval(() => {
            setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
        }, 1000);
    
        return () => clearInterval(interval);
    }, [startTime]);

    // デバッグ用ログ (アイテムの取得を確認)
    useEffect(() => {
        console.log("現在のアイテム:", playerItem);
    }, [playerItem]);
    
    useEffect(() => {
        if (playerItem) {
            console.log(`アイテム ${playerItem} を取得しました。ボタンを表示します`);
        }
    }, [playerItem]);

    useEffect(() => {
        setStartTime(Date.now());
    }, []);

    useEffect(() => {
        console.log("playerSpeed updated:", playerSpeed);
    }, [playerSpeed]);

    useEffect(() => {
        if (playerScore >= winningScore || enemyScore >= winningScore) {
            setGameOver(true);
            const winner = playerScore >= winningScore ? "Player" : "Enemy";
            setWinner(winner);
    
            // 塾の問題を強制終了
            resetJuku();
    
            // 勝利までの経過時間を計算
            const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
            updateStatistics(winner, elapsedTime);
        }
    }, [playerScore, enemyScore]);

    function generateCoins(count) {
        return Array.from({ length: count }, () => ({
            // x: Math.random() * FIELD_BOUNDARY,
            // y: Math.random() * FIELD_BOUNDARY,
            x: Math.random() * FIELD_SIZE,
            y: Math.random() * FIELD_SIZE,
        }));
    }



    // function generateItems(count) {
    //     const itemTypes = [
    //         { type: "hammer", img: hammerImg },
    //         // { type: "sake", img: sakeImg },
    //         // { type: "stun", img: stunGunImg },
    //         // { type: "drink", img: drinkImg },
    //         { type: "juku", img: jukuImg },
    //     ];
    //     return itemTypes
    //         .sort(() => Math.random() - 0.5) // シャッフル
    //         .slice(0, Math.min(ITEM_COUNT, itemTypes.length)) // 実際の種類の数と比較
    //         .map((item, index) => ({
    //             // x: (index + 1) * (FIELD_BOUNDARY / (ITEM_COUNT + 1)), // 均等配置
    //             // y: (index + 1) * (FIELD_BOUNDARY / (ITEM_COUNT + 1)),
    //             x: (index + 1) * (FIELD_SIZE / (ITEM_COUNT + 1)), // 均等配置
    //             y: (index + 1) * (FIELD_SIZE / (ITEM_COUNT + 1)),
    //             type: item.type,
    //             img: item.img,
    //         }));
    // }

    // function generateItems() {
    //     const itemTypes = [
    //         { type: "hammer", img: hammerImg },
    //         { type: "juku", img: jukuImg },
    //     ];
    
    //     return itemTypes.map(item => ({
    //         x: Math.random() * (FIELD_SIZE - PLAYER_SIZE),
    //         y: Math.random() * (FIELD_SIZE - PLAYER_SIZE),
    //         type: item.type,
    //         img: item.img,
    //     }));
    // }

    function generateItems() {
        const itemTypes = [
            { type: "hammer", img: hammerImg },
            { type: "juku", img: jukuImg },
        ];
    
        let hammerCount = 0; // 現在のハンマー数
    
        return itemTypes.map(item => {
            // 🎯 すでにハンマーがある場合、新たに追加しない
            if (item.type === "hammer" && hammerCount >= 1) return null;
            if (item.type === "hammer") hammerCount++;
    
            return {
                x: Math.random() * (FIELD_SIZE - PLAYER_SIZE),
                y: Math.random() * (FIELD_SIZE - PLAYER_SIZE),
                type: item.type,
                img: item.img,
            };
        }).filter(Boolean); // `null` を削除
    }

    function getDistance(a, b) {
        return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
    }

    const collectCoin = (entity, setScore) => {
        setCoins(prevCoins => {
            const remainingCoins = prevCoins.filter(coin => getDistance(entity, coin) > COIN_PICKUP_RANGE);
            if (remainingCoins.length < prevCoins.length) {
                setScore(prev => prev + 1);
            }
            return remainingCoins;
        });
    };

    const collectItem = (entity, setItem) => {
        setItems(prevItems => {
            return prevItems.map(item => {
                if (getDistance(entity, item) <= COIN_PICKUP_RANGE) {
                    console.log("取得したアイテム:", item.type);
                    setItem(item.type);
    
                    // 取得されたアイテムを新しいランダムな位置に配置
                    return {
                        ...item,
                        x: Math.random() * (FIELD_SIZE - PLAYER_SIZE),
                        y: Math.random() * (FIELD_SIZE - PLAYER_SIZE),
                    };
                }
                return item;
            });
        });
    };

    // ❶ ハンマーを取る確率（通常時は30%、プレイヤーのスコアが高いと100%）
    const DEFAULT_HAMMER_PICKUP_PROBABILITY = 0.3;
    const MIN_HAMMER_COUNT = 1;  // フィールド内に最低1つのハンマーを維持

    // ❷ ハンマーの再配置を行う関数
    const respawnHammer = () => {
        setItems(prevItems => {
            const hammerCount = prevItems.filter(item => item.type === "hammer").length;
    
            // 🎯 フィールドに既にハンマーがあるなら追加しない
            if (hammerCount >= 1) return prevItems;
    
            console.log("新しいハンマーを追加！");
            return [
                ...prevItems,
                {
                    type: "hammer",
                    img: hammerImg,
                    x: Math.random() * (FIELD_SIZE - PLAYER_SIZE),
                    y: Math.random() * (FIELD_SIZE - PLAYER_SIZE),
                }
            ];
        });
    };

    // ❸ 敵がアイテムを取得する関数（ハンマーを取ったら即使用）
    const collectItemForEnemy = useCallback(() => {
        setItems(prevItems => {
            return prevItems.filter(item => {
                if (getDistance(enemy, item) <= COIN_PICKUP_RANGE) {
                    console.log("敵がアイテムを取得:", item.type);
                    setEnemyItem(item.type);

                    if (item.type === "hammer") {
                        handleEnemyUseItem();  // すぐに使用
                    }

                    return false; // 取得したアイテムを削除
                }
                return true;
            });
        });
    }, [enemy]);

        
    // 敵の行動（ハンマーかコインを目指す）
    const moveEnemy = useCallback(() => {
        if (!enemyCanMove || (coins.length === 0 && items.length === 0)) return;
    
        let target = null;
    
        // 近くのハンマーを探す
        const hammerItems = items.filter(item => item.type === "hammer");
        const nearestHammer = hammerItems.length > 0
            ? hammerItems.reduce((closest, hammer) =>
                getDistance(enemy, hammer) < getDistance(enemy, closest) ? hammer : closest,
                hammerItems[0]
            )
            : null;
    
        let shouldGoForHammer = false;
    
        // ❷ プレイヤーのスコアが敵より高い場合、100% ハンマーを狙う
        if (playerScore > enemyScore) {
            shouldGoForHammer = true;
        } else if (Math.random() < DEFAULT_HAMMER_PICKUP_PROBABILITY) {
            shouldGoForHammer = true;
        }
    
        if (nearestHammer && shouldGoForHammer) {
            target = nearestHammer;
            console.log("敵はハンマーを狙っています！");
        } else {
            // **毎フレームごとに最も近いコインを計算**
            if (coins.length > 0) {
                target = coins.reduce((closest, coin) =>
                    getDistance(enemy, coin) < getDistance(enemy, closest) ? coin : closest,
                    coins[0]
                );
            }
        }
    
        if (!target) return; // 目標がない場合は動かない
    
        const dx = target.x - enemy.x;
        const dy = target.y - enemy.y;
        const distance = getDistance(enemy, target);
    
        // 敵の移動量を固定（滑らかではなく、カクカク移動）
        const moveX = distance > 0 ? (dx / distance) * enemySpeed : 0;
        const moveY = distance > 0 ? (dy / distance) * enemySpeed : 0;
    
        setEnemy(prev => {
            const newEnemyPos = {
                x: Math.max(0, Math.min(FIELD_SIZE - PLAYER_SIZE, prev.x + moveX)),
                y: Math.max(0, Math.min(FIELD_SIZE - PLAYER_SIZE, prev.y + moveY)),
            };
    
            collectCoin(newEnemyPos, setEnemyScore);
            return newEnemyPos;
        });
    
        collectItemForEnemy(); // アイテム取得処理
    }, [coins, items, enemySpeed, smartRatio, enemyCanMove, playerScore, enemyScore]);
    
    // 敵の行動を制御する
    useEffect(() => {
        const enemyMovement = setInterval(() => {
            moveEnemy();
        }, 200);
        return () => clearInterval(enemyMovement);
    }, [moveEnemy]);
    

    // ❹ 敵がハンマーを確実に使用し、新しいハンマーを追加
    const handleEnemyUseItem = useCallback(() => {
        if (enemyItem !== "hammer") return;
    
        console.log("敵がハンマーを使用！");
    
        setPlayerScore(prevPlayerScore => {
            const dropAmount = Math.min(prevPlayerScore, 30); // プレイヤーのコインを最大30枚減らす
            console.log(`プレイヤーは ${dropAmount} 枚のコインをばら撒く！`);
    
            // ばら撒くコインを追加
            setCoins(prev => [
                ...prev,
                ...Array.from({ length: dropAmount }, () => ({
                    x: Math.random() * FIELD_SIZE,
                    y: Math.random() * FIELD_SIZE,
                }))
            ]);
    
            return prevPlayerScore - dropAmount; // プレイヤーのスコアを更新
        });
    
        setEnemyItem(null);
        respawnHammer(); // ハンマーを即再配置
    }, [enemyItem]);

    // ❺ ハンマーの数を定期的にチェックし、不足していたら追加
    useEffect(() => {
      const interval = setInterval(() => {
          setItems(prevItems => {
              const hammerCount = prevItems.filter(item => item.type === "hammer").length;
              if (hammerCount < MIN_HAMMER_COUNT) {
                  console.log("ハンマーが不足しているため、新しいハンマーを追加");
                  return [
                      ...prevItems,
                      {
                          type: "hammer",
                          img: hammerImg,
                          x: Math.random() * (FIELD_SIZE - PLAYER_SIZE),
                          y: Math.random() * (FIELD_SIZE - PLAYER_SIZE),
                      }
                  ];
              }
              return prevItems;
          });
      }, 5000); // 5秒ごとにチェック

      return () => clearInterval(interval);
    }, []);

    useEffect(() => {
      const enemyItemUsageInterval = setInterval(() => {
          if (enemyItem === "hammer") {
              handleEnemyUseItem();
          }
      }, 2000);

      return () => clearInterval(enemyItemUsageInterval);
    }, [enemyItem, handleEnemyUseItem]);
    
    useEffect(() => {
        const enemyItemUsageInterval = setInterval(() => {
            if (enemyItem === "hammer") {
                handleEnemyUseItem();
            }
        }, 1000);  // 1秒ごとに使用をチェック
    
        return () => clearInterval(enemyItemUsageInterval);
    }, [enemyItem, handleEnemyUseItem]);

    useEffect(() => {
        if (!enemyCanMove) return; // 敵が止まっているときは動かさない
    
        const enemyMovement = setInterval(() => {
            moveEnemy();
        }, 200);
    
        return () => clearInterval(enemyMovement);
    }, [moveEnemy, enemyCanMove]); // `enemyCanMove` を依存関係に追加

    const handlePlayerMove = (dx, dy) => {
        setPlayer(prev => {
            const newX = Math.max(PLAYER_SIZE / 2, Math.min(FIELD_SIZE - PLAYER_SIZE / 2, prev.x + dx * (playerSpeed / PLAYER_SPEED)));
            const newY = Math.max(PLAYER_SIZE / 2, Math.min(FIELD_SIZE - PLAYER_SIZE / 2, prev.y + dy * (playerSpeed / PLAYER_SPEED)));
    
            collectCoin({ x: newX, y: newY }, setPlayerScore);
            collectItem({ x: newX, y: newY }, setPlayerItem);
            return { x: newX, y: newY };
        });
    };

    useEffect(() => {
        const handleKeyPress = (event) => {
            switch (event.key) {
                case "ArrowUp":
                    handlePlayerMove(0, -PLAYER_SPEED);
                    break;
                case "ArrowDown":
                    handlePlayerMove(0, PLAYER_SPEED);
                    break;
                case "ArrowLeft":
                    handlePlayerMove(-PLAYER_SPEED, 0);
                    break;
                case "ArrowRight":
                    handlePlayerMove(PLAYER_SPEED, 0);
                    break;
                default:
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, []);

    useEffect(() => {
        let startX, startY;
        const handleTouchStart = (event) => {
            const touch = event.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
        };

        const handleTouchMove = (event) => {
            if (!startX || !startY) return;

            const touch = event.touches[0];
            const deltaX = touch.clientX - startX;
            const deltaY = touch.clientY - startY;

            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                handlePlayerMove(deltaX > 0 ? PLAYER_SPEED : -PLAYER_SPEED, 0);
            } else {
                handlePlayerMove(0, deltaY > 0 ? PLAYER_SPEED : -PLAYER_SPEED);
            }

            startX = null;
            startY = null;
        };

        window.addEventListener("touchstart", handleTouchStart);
        window.addEventListener("touchmove", handleTouchMove);

        return () => {
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchmove", handleTouchMove);
        };
    }, []);

    // 1️⃣ 先に HandleUseItem を定義
    const HandleUseItem = () => {
        if (!playerItem) return;
    
        console.log(`Using Item: ${playerItem}`);
    
        switch (playerItem) {
            case "hammer":
                console.log("Before updating score: ", enemyScore);
                setEnemyScore(prev => {
                    const newScore = Math.max(0, prev - 30);
                    console.log(`Enemy Score Updated: ${prev} -> ${newScore}`);
                    return newScore;
                });
                setCoins(prev => [...prev, ...generateCoins(30)]);
                console.log("Hammer used! Enemy lost 30 coins.");
                break;
            // case "sake":
            //     setEnemyControlRandom(true);
            //     setTimeout(() => setEnemyControlRandom(false), 10000);
            //     console.log("Sake used! Enemy controls are now random.");
            //     break;
            // case "stun":
            //     setEnemySpeed(enemySpeed / 2);
            //     setTimeout(() => setEnemySpeed(enemySpeed), 20000);
            //     console.log("Stun gun used! Enemy speed halved for 20 seconds.");
            //     break;
            // case "drink":
            //     console.log("Before Drink Effect: playerSpeed =", playerSpeed);
            
            //     setPlayerSpeed(PLAYER_SPEED * 2); // 速度を2倍にする
            
            //     setTimeout(() => {
            //         console.log("Drink Effect Expired. Restoring speed.");
            //         setPlayerSpeed(PLAYER_SPEED); // 20秒後に元の速度に戻す
            //     }, 20000);
            
            //     console.log("Drink used! Player speed doubled for 20 seconds.");
            //     break;

            case "juku":
                console.log("Juku used! Displaying problem...");
                startJukuChallenge();  // ← 問題を開始する
                break;

            default:
                break;
        }
    
        setTimeout(() => {
            console.log("アイテムリセット前:", playerItem);
            setPlayerItem(null);
        }, 500);
    };

      // 2️⃣ useEffect の後に呼び出す
      useEffect(() => {
          const handleKeyPress = (event) => {
              if (event.key === " ") {
                  console.log("Space key pressed! アイテム使用実行");
                  HandleUseItem();
              }
          };
      
          window.addEventListener("keydown", handleKeyPress);
          return () => window.removeEventListener("keydown", handleKeyPress);
      }, [playerItem]);

    useEffect(() => {
        if (playerScore >= winningScore || enemyScore >= winningScore) {
            setGameOver(true);
            const winner = playerScore >= winningScore ? "Player" : "Enemy";
            setWinner(winner);

            // 勝利までの経過時間を計算
            const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
            
            // 戦績を保存
            updateStatistics(winner, elapsedTime);
        }
    }, [playerScore, enemyScore]);

    const updateStatistics = (winner, time) => {
        const stats = JSON.parse(localStorage.getItem("gameStats")) || { wins: 0, losses: 0, winRate: 0, bestTime: null };
        
        if (winner === "Player") {
            stats.wins += 1;
            if (!stats.bestTime || time < stats.bestTime) {
                stats.bestTime = time;
            }
        } else {
            stats.losses += 1;
        }
        
        stats.winRate = (stats.wins / (stats.wins + stats.losses)) * 100;
        localStorage.setItem("gameStats", JSON.stringify(stats));
    };

          // 塾に触れたときの処理
    const startJukuChallenge = () => {
        const { num, factors } = generatePrimeFactors();
        setJukuProblem(num);
        setJukuFactors(factors);
        setJukuAnswer(""); // 初期化
    };

    const handleJukuSubmit = (e) => {
        if (e) e.preventDefault(); // フォームのデフォルト動作を防ぐ
    
        const inputFactor = parseInt(jukuAnswer, 10);
        if (isNaN(inputFactor) || inputFactor <= 1) {
            alert("✕ 不正解！もう一度入力してください。");
            return;
        }
    
        // 🛠 修正: 入力値が jukuProblem を割り切れるかチェック
        if (jukuProblem % inputFactor !== 0) {
            alert("✕ 不正解！もう一度入力してください。");
            return;
        }
    
        const newProblem = jukuProblem / inputFactor;
        
        setJukuProblem(newProblem);
        setJukuAnswer("");
    
        if (newProblem === 1) {
            alert("解けた！");
            applyJukuEffects();
            resetJuku();
        }
    };

    // クリア時の効果
    const applyJukuEffects = () => {
        setEnemyCanMove(false);  // 敵を停止
        console.log("敵が8秒間停止します");
    
        setTimeout(() => {
            setEnemyCanMove(true); // 8秒後に動きを再開
            console.log("敵の動きが再開しました");
        }, 8000);  // 8000ミリ秒 = 8秒間
    
        // 🛠 修正: 敵のコインを直接プレイヤーに移動させる
        setPlayerScore(prevPlayerScore => prevPlayerScore + enemyScore);
        setEnemyScore(0); // 敵のスコアを0にリセット
    };

    // 塾をリセット
    const resetJuku = () => {
        setJukuProblem(null);
        setJukuFactors([]);
        setJukuAnswer(""); // 解答欄もクリア
        setItems(prevItems => prevItems.map(item => 
            item.type === "juku" ? { ...item, x: Math.random() * FIELD_SIZE, y: Math.random() * FIELD_SIZE } : item
        ));
    };

    return (
        <div className="game-container">
            <div className="scoreboard">
                <span>🎮 Player: {playerScore} | 🤖 Enemy: {enemyScore}</span>
            </div>
            <div className="game-field">
                <div className="elapsed-time">
                    ⏳ {elapsedTime} 秒
                </div>
                <div className="player" style={{ left: player.x, top: player.y }}></div>
                <div className="enemy" style={{ left: enemy.x, top: enemy.y }}></div>
                {coins.map((coin, index) => (
                    <div key={index} className="coin" style={{ left: coin.x, top: coin.y }}></div>
                ))}
                {items.map((item, index) => (
                    <img
                        key={index}
                        src={item.img}
                        className={`item ${item.type}`}
                        style={{
                            left: `${item.x}px`,
                            top: `${item.y}px`,
                            width: `${COIN_RADIUS * 2}px`,  // コインと同じサイズ
                            height: `${COIN_RADIUS * 2}px`
                        }}
                        alt={item.type}
                    />
                ))}
            </div>
    
            {/* 勝敗表示をここに追加 */}
            {gameOver && (
                <div className="game-over">
                    <h1>{winner === "Player" ? "WINNER 🎉" : "LOSER 😢"}</h1>
                    <button onClick={() => window.location.reload()}>もう一度遊ぶ</button>
                    <button onClick={() => navigate("/")}>ホームに戻る</button>
                </div>
            )}
    
            <button className="home-button" onClick={() => navigate("/")}>ホームに戻る</button>
            
            {/* アイテム使用ボタン */}
            {playerItem && (
                <button className="use-item-button" onClick={() => {
                    console.log("Use Item Button Clicked! アイテム使用実行");
                    HandleUseItem();
                }}>
                    {playerItem.toUpperCase()} を使う
                </button>
            )}

            {/* 塾の問題表示 */}
            {jukuProblem !== null && (
                <div className="juku-modal">
                    <h2>素因数分解の問題</h2>
                    <p>{jukuProblem}</p>
                    <input
                        type="number"
                        value={jukuAnswer}
                        onChange={(e) => setJukuAnswer(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleJukuSubmit();
                            }
                        }}
                    />
                    <button onClick={handleJukuSubmit}>解答</button>
                </div>
            )}

        </div>
    );
};

export default GameScreen;