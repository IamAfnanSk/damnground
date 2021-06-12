import { Socket } from "socket.io-client";

export interface ICodeEditorProps {
  currentFile: string;
  currentFileContent: string;
  currentFileLanguage: string;
  socket: Socket | null;
  updateFile: any;
}
