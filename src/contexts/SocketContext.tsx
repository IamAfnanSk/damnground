import { createContext } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(io());

export const useSocket = () => {
  return SocketContext;
};

export default SocketContext;
