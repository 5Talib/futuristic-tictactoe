import { useEffect, useRef, useState } from "react";
import Room from "../components/Room";
import socket from "../utils/socket";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function JoinRoom() {
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");
  const roomIdRef = useRef("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket) return;

    socket.on("room-info", ({success}) => {
        console.log(success);
        if(success) {
            toast.success("Successfully joined room");
            navigate(`/game/${roomIdRef.current}`);
        } else {
            toast.error("Room size exceeded");
        }
    });

    return () => {
      socket.off("room-info"); 
    };
  }, [navigate]);

  const handleJoinRoom = () => {
    // console.log(name, roomId);
    if(!name){
        toast.error("Please provide your name");
        return;
    } 
    if(!roomId){
        toast.error("Please provide room code");
        return;
    } 
    roomIdRef.current = roomId;
    socket.emit("join-room", { name, roomId });
  };
  return (
    <Room
      createRoom={false}
      name={name}
      setName={setName}
      roomId={roomId}
      setRoomId={setRoomId}
      handleSubmit={handleJoinRoom}
    />
  );
}
