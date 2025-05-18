import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      <h1 className="text-6xl md:text-7xl font-bold text-center mb-4 animate-pulse">
        <span className="text-cyan-400 neon-glow">Tic-</span>
        <span className="text-pink-500 neon-glow">Tac-</span>
        <span className="text-purple-400 neon-glow">Toe</span>
      </h1>
      <p className="text-xl md:text-2xl text-gray-300 mb-10 text-center">
        The classic game with a futuristic twist
      </p>
      <div className="flex gap-6">
        <button
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg text-lg font-semibold neon-border cursor-pointer"
          onClick={() => navigate("/create-room")}
        >
          Create Room
        </button>
        <button
          className="bg-cyan-400 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg text-lg font-semibold blue-border cursor-pointer"
          onClick={() => navigate("/join-room")}
        >
          Join Room
        </button>
      </div>
    </div>
  );
}
