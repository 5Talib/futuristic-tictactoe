import { useEffect, useState } from "react";
import Room from "../components/Room";
import socket from "../utils/socket";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {generateRoomCode} from "../utils/utility";

export default function CreateRoom() {
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setRoomId(generateRoomCode());
  }, []);


  useEffect(() => {
    if (!socket) return;

    socket.on("room-info", (success) => {
        if(success) {
            toast.success("Successfully joined room");
        } else {
            toast.error("Room size exceeded");
        }
    });

    return () => {
      socket.off("room-info"); 
    };
  }, []);

  const handleCreateRoom = () => {
    // console.log(name, roomId);
    if(!name){
        toast.error("Please provide your name");
        return;
    } 
    socket.emit("join-room", {name, roomId});
    navigate(`/game/${roomId}`);
  };
  return (
    <Room
      createRoom={true}
      name={name}
      setName={setName}
      roomId={roomId}
      setRoomId={setRoomId}
      handleSubmit={handleCreateRoom}
    />
  );
}
