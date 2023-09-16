import { useState } from "react";
import { fileExtensionMap } from "../../constants/fileExtensionMap";
import { ISideBarProps } from "../../interfaces/ISideBarProps";

import styles from "./styles.module.scss";

const SideBar = ({
  containerSocket,
  setCurrentFilePath,
  filesAndFolders,
}: ISideBarProps) => {
  const [currentSection, setCurrentSection] = useState<"files" | "about">(
    "files"
  );

  const [addingNewFile, setAddingNewFile] = useState(false);

  const [newFileName, setNewFileName] = useState<string | null>(null);

  function deleteFile(name: string) {
    containerSocket?.emit(
      "fileInput",
      JSON.stringify({ request: "delete", name })
    );
  }

  function handleAddFile() {
    containerSocket?.emit(
      "fileInput",
      JSON.stringify({ request: "touch", name: newFileName })
    );
    setNewFileName(null);
    setAddingNewFile(false);
  }

  return (
    <>
      <div className="h-full flex">
        <div className={styles.sidebarOptions}>
          <div
            className={`${styles.option} ${
              currentSection === "about" ? styles.optionSelected : ""
            }`}
            onClick={() => setCurrentSection("about")}
          >
            <img
              src="https://www.afnan.dev/_vercel/image?url=/images/logo-dark.svg&w=1536&q=100"
              alt="logo"
              className="h-6 py-2 mx-auto px-1"
            />
          </div>
          <div
            className={`${styles.option} ${
              currentSection === "files" ? styles.optionSelected : ""
            }`}
            onClick={() => setCurrentSection("files")}
          >
            <div className={styles.icon + " codicon codicon-files"}></div>
          </div>
        </div>

        <div className="flex-1">
          <div className={styles.sidebarContents}>
            {currentSection === "about" && (
              <div className="p-4">
                <h2 className="font-bold">About coding ground</h2>
                <p className="mt-3 text-sm font-light">
                  Just a fun project where you can use actual terminal and files
                  from the browser, try running `static-server` in the terminal
                </p>
                <p className="my-3 text-lg">
                  Made by <b>Afnan Shaikh</b>
                </p>

                <div className="text-xs">
                  <a
                    href="https://afnan.dev?utm_source=damnground"
                    referrerPolicy="no-referrer"
                    target="_blank"
                    className="text-green-300 block"
                    rel="noreferrer"
                  >
                    afnan.dev
                  </a>
                </div>

                <div className="mt-8 text-sm font-light">
                  <span className="text-red-400">Limitation:</span>
                  <ul className="list-disc flex flex-col gap-2 mt-2">
                    <li>
                      Currently the same server is assigned and it shares the
                      terminal and files, idealy there should be a backend that
                      assigns separate server to each user to keep things
                      separate.
                    </li>

                    <li>
                      Folders are not supported, only top level files are
                      supported
                    </li>

                    <li>
                      Made in very short time, expect bugs / unhandled edge
                      cases
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {currentSection === "files" && (
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
                    }}
                  ></div>
                </div>

                <div className="py-2 px-4">
                  {addingNewFile && (
                    <div
                      onKeyUp={(event) => {
                        if (event.code === "Enter") {
                          handleAddFile();
                        }
                      }}
                      className={
                        styles.file +
                        " flex items-center cursor-pointer justify-between"
                      }
                    >
                      <div className="flex items-center flex-1">
                        <input
                          type="text"
                          className="p-0 bg-transparent w-full"
                          onChange={(e) => setNewFileName(e.target.value)}
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
                            setCurrentFilePath(element.name);
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
