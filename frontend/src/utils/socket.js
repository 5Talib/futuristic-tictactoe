import { io } from "socket.io-client";
import { backendURL } from "./utility";

const socket = io(backendURL);
export default socket;
