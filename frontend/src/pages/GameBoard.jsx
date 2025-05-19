import { useEffect, useState } from "react";
import socket from "../utils/socket";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { checkWinner } from "../utils/utility";
import GameLoading from "./GameLoading";

export default function GameBoard({isRoomRef, name}) {
  const navigate = useNavigate();
  const Initailboard = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  const { roomId } = useParams();

  const [board, setBoard] = useState(Initailboard);
  const [role, setRole] = useState("");
  const [turn, setTurn] = useState("A");
  const [moves, setMoves] = useState(null);
  const [winningCells, setWinningCells] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playerALastMove, setPlayerALastMove] = useState();
  const [playerBLastMove, setPlayerBLastMove] = useState();

  useEffect(()=>{
    if(!isRoomRef.current) handleLeaveRoom();
  },[]);

  useEffect(() => {
    if (!socket || !socket.id || !roomId) return;

    socket.emit("check-user-in-room", roomId);

    socket.on("user-in-room-status", ({ isInRoom, roomStrength }) => {
      if (isInRoom === undefined || isInRoom === false) navigate("/");
      if (isInRoom && roomStrength === 2) setLoading(false);
    });

    return () => {
      socket.off("user-in-room-status");
    };
  }, [roomId, navigate]);

  useEffect(() => {
    socket.on("room-left", ({ success }) => {
      if (success) {
        toast.success("Room left successfully");
        navigate("/");
      } else {
        toast.error("Something went wrong! Please try again");
      }
    });
    socket.on("user-left-room", ({success}) => {
        if(success){
            toast.error("Opponent has left the room");
            setTimeout(() => {
                handleLeaveRoom();
            }, 1000);
        }
    })
    return () => {
      socket.off("room-left");
      socket.off("user-left-room");
    };
  }, []);

  useEffect(() => {
    if (!socket || !socket.id || !roomId) return;

    socket.emit("request-player-role", { roomId });
    socket.once("player-role", (role) => {
      // mounts only once
      if (role === "A") {
        setRole("A");
      } else {
        setRole("B");
      }
      setTimeout(() => {
        toast(`You are player ${role}`, {
          icon: "👏",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      }, 2000);
    });
    return () => {
      socket.off("player-role");
    };
  }, [roomId]);

  useEffect(() => {
    socket.on("move-made", ({ latestMoves, nextTurn }) => {
      setMoves(latestMoves);
      setTurn(nextTurn);

      // rendering new board after every move
      const newBoard = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
      ];
      ["A", "B"].forEach((player) => {
        latestMoves[player].forEach(({ x, y }) => {
          newBoard[x][y] = player === "A" ? "X" : "O";
        });
      });

      if (latestMoves["A"].length === 3) {
        setPlayerALastMove(latestMoves["A"][0]);
      }
      if (latestMoves["B"].length === 3) {
        setPlayerBLastMove(latestMoves["B"][0]);
      }

      setBoard(newBoard);

      // Check winner
      const winnerX = checkWinner(newBoard, "X");
      const winnerO = checkWinner(newBoard, "O");

      if (winnerX) {
        setWinningCells(winnerX);
        toast.success("Player A wins!");
      } else if (winnerO) {
        setWinningCells(winnerO);
        toast.success("Player B wins!");
      }
    });
    return () => {
      socket.off("move-made");
    };
  }, [board, roomId]);

  const handleCellClick = (row, col) => {
    if (turn === role) {
      socket.emit("make-move", {
        roomId,
        move: { x: row, y: col, player: role },
      });
    } else {
      toast.error("Wait for your turn!");
    }
  };
  console.log(moves);

  const handleLeaveRoom = () => {
    socket.emit("leave-room", { roomId });
  };

  return (
    <>
      {loading ? (
        <GameLoading />
      ) : (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black font-orbitron text-white px-4">
          {/* Title */}
          <h1 className="text-5xl font-bold mb-4 animate-pulse">
            <span className="text-cyan-400 neon-glow">Tic</span>
            <span className="text-white neon-glow">-</span>
            <span className="text-pink-500 neon-glow">Tac</span>
            <span className="text-white neon-glow">-</span>
            <span className="text-purple-500 neon-glow">Toe</span>
          </h1>

          {/* Room info */}
          <p className="text-gray-400 mb-1">
            Room: <span className="text-white">{roomId}</span>
          </p>
          <p className="text-gray-500 mb-6">
            Playing as: <span className="text-white">{name}</span>
          </p>

          {/* Next player */}
          <h2 className="text-2xl font-bold mb-4 text-white">
            Current turn: <span className="text-cyan-400">{turn === role ? name : "Opponent"}</span>
          </h2>

          {/* Board */}
          <div className="grid grid-cols-3 gap-2 p-2 border border-cyan-400 neon-border mb-8">
            {board.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={rowIndex + colIndex}
                  className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center border border-cyan-500 text-6xl font-bold cursor-pointer select-none rounded-md hover:outline-[#0ff] hover:outline-2
                ${
                  winningCells.some(
                    ([x, y]) => x === rowIndex && y === colIndex
                  )
                    ? "bg-green-400 animate-pulse"
                    : ""
                }
                ${
                  playerALastMove &&
                  playerALastMove.x === rowIndex &&
                  playerALastMove.y === colIndex &&
                  "bg-gray-700 border-purple-400 text- animate-pulse opacity-70 transition duration-500"
                }
                ${
                  playerBLastMove &&
                  playerBLastMove.x === rowIndex &&
                  playerBLastMove.y === colIndex &&
                  "bg-gray-700 border-purple-400 animate-pulse opacity-70 transition duration-500"
                }
              `}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                >
                  {cell === "X" ? (
                    <span className="text-pink-500 neon-glow">X</span>
                  ) : cell === "O" ? (
                    <span className="text-cyan-400 neon-glow">O</span>
                  ) : (
                    ""
                  )}
                </div>
              ))
            )}
          </div>

          {/* Buttons */}
          <div className="flex">
            <button
              className="px-6 py-2 border border-pink-500 text-white hover:bg-pink-800 transition rounded-md cursor-pointer"
              onClick={handleLeaveRoom}
            >
              Leave Game
            </button>
          </div>
        </div>
      )}
    </>
  );
}
