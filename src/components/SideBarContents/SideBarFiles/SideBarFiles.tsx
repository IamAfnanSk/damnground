import { useEffect } from "react";
import { useState } from "react";
import { useContext } from "react";
import { fileExtensionMap } from "../../../constants/fileExtensionMap";
import SocketContext from "../../../contexts/SocketContext";
import { IFileFolders } from "../../../types/IFileFolders";
import styles from "./styles.module.scss";

function SideBarFiles() {
  const socket = useContext(SocketContext);
  const [filesAndFolders, setFilesAndFolders] = useState<IFileFolders[]>([]);

  useEffect(() => {
    socket.on("fileOutput", (data) => {
      if (data !== "done") {
        setFilesAndFolders(JSON.parse(data));
      }
    });
    socket.on("fileWatcher", (data) => {
      setFilesAndFolders(JSON.parse(data));
    });

    socket.emit("fileInput", JSON.stringify({ type: "ls" }));
    // socket.emit(
    //   "fileInput",
    //   JSON.stringify({ type: "touch", file: "index.html" })
    // );
    // socket.emit("fileInput", JSON.stringify({ type: "touch", file: "app.js" }));
    // socket.emit(
    //   "fileInput",
    //   JSON.stringify({ type: "touch", file: "syles.scss" })
    // );
  }, [socket]);

  return (
    <>
      <div
        className={
          styles.container + " flex items-center justify-between w-full p-2"
        }
      >
        <p className="text-xs font-bold">FILES</p>
        <div className="codicon codicon-new-file cursor-pointer"></div>
      </div>

      <div className="py-1 px-3">
        {filesAndFolders.map((element) => {
          const splittedName = element.name.split(".");
          const extension = splittedName[splittedName.length - 1];

          const mappedName = fileExtensionMap[extension];

          const imageSrc = mappedName
            ? `https://raw.githubusercontent.com/devicons/devicon/master/icons/${mappedName}/${mappedName}-original.svg`
            : "/assets/file.png";

          function deleteFile() {
            socket.emit(
              "fileInput",
              JSON.stringify({
                type: "delete",
                file: element.name,
              })
            );
          }

          return (
            <div
              className="flex items-center cursor-pointer"
              key={element.name}
              onClick={deleteFile}
            >
              <img src={imageSrc} className="w-4" alt="file icon" />
              <p className="ml-2">{element.name}</p>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default SideBarFiles;
