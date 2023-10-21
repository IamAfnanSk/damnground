import { Socket } from "socket.io-client";

export interface ITerminalProps {
  containerSocket: Socket | null;
  editorRows: number;
}
