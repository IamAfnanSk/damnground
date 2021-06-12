import { Socket } from "socket.io-client";

export interface ITerminalProps {
  socket: Socket | null;
}
