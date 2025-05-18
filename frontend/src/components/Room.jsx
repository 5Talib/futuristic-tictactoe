import { useNavigate } from "react-router-dom";
import InputFields from "./InputFields";

export default function Room({
  createRoom,
  name,
  setName,
  roomId,
  setRoomId,
  handleSubmit,
}) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-black font-orbitron">
      <div className="neon-border p-8 w-full max-w-md bg-[#0b0b0b]">
        <h1 className="text-4xl text-white font-bold text-center mb-8 neon-glow">
          {createRoom ? "Create" : "Join"} Room
        </h1>

        <InputFields
          label={"Your Name"}
          placeholder={"Enter Your Name"}
          createRoom={createRoom}
          field={name}
          setField={setName}
        />
        <InputFields
          label={"Room Code"}
          placeholder={"Enter Room Code"}
          createRoom={createRoom}
          field={roomId}
          setField={setRoomId}
        />

        <div className="flex justify-between">
          <button className="px-6 py-2 bg-transparent border border-cyan-400 text-cyan-400 hover:bg-cyan-800 transition rounded-md cursor-pointer"
          onClick={()=>(navigate("/"))}
          >
            Back
          </button>
          <button
            className="px-6 py-2 bg-transparent text-white hover:bg-purple-600 transition border border-[#a855f7] rounded-md cursor-pointer"
            onClick={handleSubmit}
          >
            {createRoom ? "Create" : "Join"}
          </button>
        </div>
      </div>
    </div>
  );
}
