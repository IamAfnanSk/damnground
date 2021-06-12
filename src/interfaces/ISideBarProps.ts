import { Socket } from "socket.io-client";

export interface ISideBarProps {
  socket: Socket | null;
  updateCurrentFile: any;
  addFile: any;
}
