import { Socket } from "socket.io-client";
import { IFileFolders } from "./IFileFolders";

export interface ICodeEditorProps {
  currentFilePath: string;
  containerSocket: Socket | null;
  refreshOutput(delay?: boolean): void;
  filesAndFoldersInitial: React.MutableRefObject<IFileFolders[]>;
}
