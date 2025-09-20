import React, { useState, useEffect } from "react";

const GRID_SIZE = 20;
const CELL_SIZE = 20;

export default function Snake() {
  const [snake, setSnake] = useState([
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [running, setRunning] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(
    () => Number(localStorage.getItem("snake_highscore")) || 0
  );
  const [speed, setSpeed] = useState(200);
  const [gameOver, setGameOver] = useState(false);

  // countdown
  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      setRunning(true);
      setCountdown(null);
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // loop
  useEffect(() => {
    if (!running) return;
    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [running, snake, direction, speed]);

  const moveSnake = () => {
    const head = { ...snake[0] };
    head.x += direction.x;
    head.y += direction.y;

    // colisão
    if (
      head.x < 0 ||
      head.y < 0 ||
      head.x >= GRID_SIZE ||
      head.y >= GRID_SIZE ||
      snake.some((s) => s.x === head.x && s.y === head.y)
    ) {
      endGame();
      return;
    }

    const newSnake = [head, ...snake];
    if (head.x === food.x && head.y === food.y) {
      setScore((s) => s + 10);
      setSpeed((sp) => Math.max(50, sp - 5)); // acelera
      setFood({
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      });
    } else {
      newSnake.pop();
    }
    setSnake(newSnake);
  };

  const resetGame = () => {
    setSnake([
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ]);
    setDirection({ x: 1, y: 0 });
    setFood({ x: 5, y: 5 });
    setScore(0);
    setSpeed(200);
    setGameOver(false);
  };

  const endGame = () => {
    setRunning(false);
    setGameOver(true);
    if (score > highScore) {
      localStorage.setItem("snake_highscore", score);
      setHighScore(score);
    }
  };

  // controles
  useEffect(() => {
    const handleKey = (e) => {
      switch (e.key) {
        case "ArrowUp":
          if (direction.y === 1) return;
          setDirection({ x: 0, y: -1 });
          break;
        case "ArrowDown":
          if (direction.y === -1) return;
          setDirection({ x: 0, y: 1 });
          break;
        case "ArrowLeft":
          if (direction.x === 1) return;
          setDirection({ x: -1, y: 0 });
          break;
        case "ArrowRight":
          if (direction.x === -1) return;
          setDirection({ x: 1, y: 0 });
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [direction]);

  return (
    <div className="flex flex-col items-center gap-4 mt-6">
      <h1 className="text-2xl font-bold">🐍 Snake Game</h1>
      <div className="flex gap-6 text-lg">
        <p>Score: <span className="font-bold">{score}</span></p>
        <p>Highscore: <span className="font-bold">{highScore}</span></p>
      </div>

      {/* Botão iniciar */}
      {!running && !gameOver && countdown === null && (
        <button
          onClick={() => {
            resetGame();
            setCountdown(3);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Iniciar Jogo
        </button>
      )}

      {/* Countdown */}
      {countdown !== null && (
        <div className="text-6xl font-bold animate-pulse">{countdown}</div>
      )}

      {/* Grid */}
      <div
        className="grid border border-gray-400 bg-gray-100"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
        }}
      >
        {[...Array(GRID_SIZE)].map((_, y) =>
          [...Array(GRID_SIZE)].map((_, x) => {
            const isHead = snake[0].x === x && snake[0].y === y;
            const isSnake = snake.some((s) => s.x === x && s.y === y);
            const isFood = food.x === x && food.y === y;
            return (
              <div
                key={`${x}-${y}`}
                className={`w-5 h-5 transition-colors ${
                  isHead
                    ? "bg-green-800"
                    : isSnake
                    ? "bg-green-500"
                    : isFood
                    ? "bg-red-500"
                    : "bg-gray-100"
                }`}
              />
            );
          })
        )}
      </div>

      {/* Game Over Overlay */}
      {gameOver && (
        <div className="mt-4 text-center">
          <h2 className="text-3xl font-bold text-red-600">Game Over!</h2>
          <p className="mt-2 text-lg">Sua pontuação: {score}</p>
          <button
            onClick={() => {
              resetGame();
              setCountdown(3);
            }}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Jogar Novamente
          </button>
        </div>
      )}
    </div>
  );
}
