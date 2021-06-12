import { useRef } from "react";
import { useEffect, useState } from "react";
import { fileExtensionMap } from "../../constants/fileExtensionMap";
import { IFileFolders } from "../../interfaces/IFileFolders";
import { ISideBarProps } from "../../interfaces/ISideBarProps";

import styles from "./styles.module.scss";

const SideBar = (props: ISideBarProps) => {
  const [option, setOption] = useState("files");
  const [filesAndFolders, setFilesAndFolders] = useState<IFileFolders[]>([]);
  const [addingNewFile, setAddingNewFile] = useState(false);

  const addFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const socket = props.socket;

    function lsEventHandler(data: string) {
      const response = JSON.parse(data);
      const { filesAndFolders } = response;

      if (filesAndFolders) {
        setFilesAndFolders(filesAndFolders);
      }
    }

    if (socket) {
      socket.off("fileOutput", lsEventHandler).on("fileOutput", lsEventHandler);
      socket.on("fileWatcher", (data: string) => {
        const response = JSON.parse(data);
        const { filesAndFolders } = response;

        if (filesAndFolders) {
          setFilesAndFolders(filesAndFolders);
        }
      });

      socket.emit("fileInput", JSON.stringify({ request: "ls" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.socket]);

  function deleteFile(name: string) {
    props.socket?.emit(
      "fileInput",
      JSON.stringify({ request: "delete", name })
    );
  }

  function addFile() {
    props.socket?.emit(
      "fileInput",
      JSON.stringify({ request: "touch", name: addFileInputRef.current?.value })
    );
    setAddingNewFile(false);
    props.addFile({
      name: addFileInputRef.current?.value,
      content: "",
      type: "file",
    });
  }

  return (
    <>
      <div className="h-full flex">
        <div className={styles.sidebarOptions}>
          <div
            className={`${styles.option} ${
              option === "about" ? styles.optionSelected : ""
            }`}
            onClick={() => setOption("about")}
          >
            <img
              src="https://codedamn.com/_next/image?url=%2Fassets%2Fimages%2Fwhite-logo.png&w=32&q=75"
              alt="Codedamn logo"
              className="h-12 mx-auto px-1 py-1"
            />
          </div>
          <div
            className={`${styles.option} ${
              option === "files" ? styles.optionSelected : ""
            }`}
            onClick={() => setOption("files")}
          >
            <div className={styles.icon + " codicon codicon-files"}></div>
          </div>
        </div>

        <div className="flex-1">
          <div className={styles.sidebarContents}>
            {option === "about" && (
              <div className="p-4">
                <h2 className="text-xl font-bold">About coding ground</h2>
                <p className="mt-3 font-light">
                  This interface helps you code in browser and see the immediate
                  output. Complete the challenges mentioned and proceed forward
                  with the next ones!
                </p>
              </div>
            )}

            {option === "files" && (
              <>
                <div
                  className={
                    styles.filesContainer +
                    " flex items-center justify-between w-full p-2"
                  }
                >
                  <p className="text-xs font-bold">FILES</p>
                  <div
                    className="codicon codicon-new-file cursor-pointer"
                    onClick={() => {
                      setAddingNewFile(true);
                      setTimeout(() => {
                        addFileInputRef.current?.focus();
                      }, 1);
                    }}
                  ></div>
                </div>

                <div className="py-2 px-4">
                  {addingNewFile && (
                    <div
                      onKeyPress={(event) => {
                        if (event.code === "Enter") {
                          addFile();
                        }
                      }}
                      className={
                        styles.file +
                        " flex items-center cursor-pointer justify-between"
                      }
                    >
                      <div className="flex items-center flex-1">
                        <input
                          ref={addFileInputRef}
                          type="text"
                          className="p-0 bg-transparent w-full"
                        />
                        {/* <p className="ml-1.5 text-sm"></p> */}
                      </div>
                      <div>
                        <div
                          className="codicon codicon-close ml-2"
                          onClick={() => {
                            setAddingNewFile(false);
                          }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {filesAndFolders.map((element) => {
                    if (element.type === "directory") {
                      return (
                        <div
                          className={
                            styles.file +
                            " flex items-center cursor-pointer justify-between"
                          }
                          key={element.name}
                        >
                          <div className="flex items-center flex-1">
                            <img
                              src="/assets/folder.png"
                              className="h-4"
                              alt="file icon"
                            />
                            <p className="ml-1.5">{element.name}</p>
                          </div>
                        </div>
                      );
                    }

                    const splittedName = element.name.split(".");
                    const extension = splittedName[splittedName.length - 1];

                    const mappedName = fileExtensionMap[extension];

                    const imageSrc = mappedName
                      ? `https://raw.githubusercontent.com/devicons/devicon/master/icons/${mappedName}/${mappedName}-original.svg`
                      : "/assets/file.png";

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
                          onClick={() => {
                            props.updateCurrentFile(element.name);
                          }}
                        >
                          <img src={imageSrc} className="w-5" alt="file icon" />
                          <p className="ml-1.5">{element.name}</p>
                        </div>

                        <div>
                          <div
                            className="codicon codicon-trash ml-2"
                            onClick={() => {
                              deleteFile(element.name);
                            }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBar;
