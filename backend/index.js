// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { frontendURL } = require("./utils/utility");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: frontendURL, 
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => res.send("You are on the backend"));

let roomPlayers = {};

/* roomPlayers = {
  room123: {
    A: "socketId_1",
    B: "socketId_2",
  },
  room456: {
    A: "socketId_3",
    // B is not yet assigned
  },
}; */

let gameState = {};

/* gameState = {
  [roomId]: {
    A: [],
    B: [],
    turn: "A",
  },
}; */

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("check-user-in-room", (roomId) => {
    try {
      const room = io.sockets.adapter.rooms.get(roomId);
      const isInRoom = room?.has(socket.id) || false;
      const roomStrength = room?.size || 0;
      io.to(roomId).emit("user-in-room-status", { isInRoom, roomStrength });
    } catch (err) {
      console.error("Error in check-user-in-room:", err);
    }
  });

  socket.on("join-room", ({ name, roomId }) => {
    try {
      const room = io.sockets.adapter.rooms.get(roomId);
      const roomStrength = room ? room.size : 0;

      if (roomStrength < 2) {
        socket.join(roomId);
        console.log(`User ${name} joined room ${roomId}`);
        io.to(socket.id).emit("room-info", { success: true });

        if (!roomPlayers[roomId]) {
          roomPlayers[roomId] = { A: socket.id };
        } else {
          roomPlayers[roomId].B = socket.id;
        }

        if (!gameState[roomId]) {
          gameState[roomId] = {
            A: [],
            B: [],
            turn: "A",
          };
        }
      } else {
        io.to(socket.id).emit("room-info", { success: false });
      }
    } catch (err) {
      console.error("Error in join-room:", err);
    }
  });

  socket.on("request-player-role", ({ roomId }) => {
    try {
      const players = roomPlayers[roomId];
      if (!players) return;
      const role = players.A === socket.id ? "A" : "B";
      socket.emit("player-role", role);
    } catch (err) {
      console.error("Error in request-player-role:", err);
    }
  });

  socket.on("leave-room", ({ roomId }) => {
    try {
      socket.leave(roomId);
      console.log(`User left room ${roomId}`);
      io.to(socket.id).emit("room-left", { success: true });
      socket.to(roomId).emit("user-left-room", {success: true});
    } catch (err) {
      console.error("Error in leave-room:", err);
    }
  });

  socket.on("make-move", async ({ roomId, move }) => {
    try {
      const { player, x, y } = move;

      if (!gameState[roomId] || gameState[roomId].turn !== player) return;

      gameState[roomId][player].push({ x, y, player });

      if (gameState[roomId][player].length > 3) {
        gameState[roomId][player].shift();
      }

      console.log(`Move by Player ${player} at (${x}, ${y})`);

      gameState[roomId].turn = player === "A" ? "B" : "A";

      io.to(roomId).emit("move-made", {
        latestMoves: {
          A: gameState[roomId].A,
          B: gameState[roomId].B,
        },
        nextTurn: gameState[roomId].turn,
      });
    } catch (err) {
      console.error("Error in make-move:", err);
    }
  });

  socket.on("disconnect", () => {
    try {
      console.log("User disconnected:", socket.id);

      // Cleanup player from roomPlayers
      for (const roomId in roomPlayers) {
        const players = roomPlayers[roomId];
        if (players.A === socket.id) delete players.A;
        if (players.B === socket.id) delete players.B;

        // If both players are gone, clean up the room
        if (!players.A && !players.B) {
          delete roomPlayers[roomId];
          delete gameState[roomId];
        }
      }
    } catch (err) {
      console.error("Error during disconnect:", err);
    }
  });
});

server.listen(4000, () => {
  console.log("Server running on port 4000");
});
