import { useEffect } from "react";
import { useState } from "react";
import { useContext } from "react";
import { fileExtensionMap } from "../../../constants/fileExtensionMap";
import SocketContext from "../../../contexts/SocketContext";
import { IFileFolders } from "../../../types/IFileFolders";
import styles from "./styles.module.scss";

function SideBarFiles(props: any) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

      <div className="py-2 px-4">
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

          function changeCurrentFile() {
            props.changeCurrentFile(element);
          }

          function renameFile() {
            // props.changeCurrentFile(element);
          }

          return (
            <div
              className={
                styles.file +
                " flex items-center cursor-pointer justify-between"
              }
              key={element.name}
            >
              <div
                className="flex items-center flex-1"
                onClick={changeCurrentFile}
              >
                <img src={imageSrc} className="w-4" alt="file icon" />
                <p className="ml-1.5 text-sm">{element.name}</p>
              </div>

              <div>
                <div
                  onClick={renameFile}
                  className="codicon codicon-edit"
                ></div>
                <div
                  onClick={deleteFile}
                  className="codicon codicon-trash ml-2"
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default SideBarFiles;
