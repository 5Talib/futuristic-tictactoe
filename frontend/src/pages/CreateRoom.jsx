import { useEffect, useRef, useState } from "react";
import Room from "../components/Room";
import socket from "../utils/socket";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {generateRoomCode} from "../utils/utility";

export default function CreateRoom({isRoomRef, name, setName}) {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();
  const roomIdRef = useRef("");

  useEffect(() => {
    setRoomId(generateRoomCode());
  }, []);


  useEffect(() => {
    if (!socket) return;

    socket.on("room-info", (success) => {
        if(success) {
            isRoomRef.current = true;
            toast.success("Successfully joined room");
            navigate(`/game/${roomIdRef.current}`, { state: { joined: true } });
            // navigate(`/game/${roomId}`, { state: { joined: true } });

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
    roomIdRef.current = roomId;
    socket.emit("join-room", {name, roomId});
    // navigate(`/game/${roomId}`);
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
