import React from "react";

const GameLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4">
      <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-8 text-cyan-400 neon-glow text-center">
        Connecting to Room...
      </h1>

      <div className="loader mb-6 w-12 h-12 border-4 border-t-cyan-400 border-white rounded-full animate-spin" />

      <p className="text-base sm:text-lg text-gray-300 font-mono text-center">
        Waiting for opponent to join
      </p>
    </div>
  );
};

export default GameLoading;
