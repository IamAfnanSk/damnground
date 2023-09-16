import { Socket } from "socket.io-client";
import { IFileFolders } from "./IFileFolders";

export interface ISideBarProps {
  containerSocket: Socket | null;
  filesAndFolders: IFileFolders[];
  setCurrentFilePath: React.Dispatch<React.SetStateAction<string>>;
}
