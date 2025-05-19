import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import CreateRoom from "./pages/CreateRoom";
import JoinRoom from "./pages/JoinRoom";
import GameBoard from "./pages/GameBoard";
import { Toaster } from "react-hot-toast";
import { useRef, useState } from "react";

function App() {
  const isRoomRef = useRef(false);
  const [name, setName] = useState("");
  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/create-room"
            element={<CreateRoom isRoomRef={isRoomRef} name={name} setName={setName} />}
          />
          <Route
            path="/join-room"
            element={<JoinRoom isRoomRef={isRoomRef} name={name} setName={setName} />}
          />
          <Route path="/game/:roomId" element={<GameBoard isRoomRef={isRoomRef} name={name} />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
