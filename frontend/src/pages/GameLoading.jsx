import React from "react";

const GameLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-4xl md:text-5xl font-bold mb-8 text-cyan-400 neon-glow">
        Connecting to Room...
      </h1>
      <div className="loader mb-6" />
      <p className="text-lg text-gray-300 font-mono">Waiting for opponent to join</p>
    </div>
  );
};

export default GameLoading;
