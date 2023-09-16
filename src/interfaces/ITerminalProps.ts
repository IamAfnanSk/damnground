import { Socket } from "socket.io-client";

export interface ITerminalProps {
  containerSocket: Socket | null;
  refreshOutput(delay?: boolean): void;
  editorRows: number;
}
