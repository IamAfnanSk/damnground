import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import { ReflexContainer, ReflexSplitter, ReflexElement } from "react-reflex";
import { useParams, useNavigate } from "react-router-dom";

import styles from "./styles.module.scss";

import { config } from "../../config/config";

import SideBar from "../../components/SideBar/SideBar";
import Terminal from "../../components/Terminal/Terminal";
import CodeOutput from "../../components/CodeOutput/CodeOutput";
import CodeEditor from "../../components/CodeEditor/CodeEditor";
import Footer from "../../components/Footer/Footer";

import { IFileFolders } from "../../interfaces/IFileFolders";

function Home() {
  const navigate = useNavigate();
  const params = useParams();

  const snippetIdParam = useRef<string | null>(
    params.id === localStorage.getItem("snippetId") ? params.id : null
  );

  const refreshOutputTimer = useRef<NodeJS.Timeout | null>(null);
  const filesAndFoldersInitial = useRef<IFileFolders[]>([]);

  // Main socket
  const [containerSocket, setContainerSocket] = useState<Socket | null>(null);
  const [currentFilePath, setCurrentFilePath] = useState<string>("");
  const [filesAndFolders, setFilesAndFolders] = useState<IFileFolders[]>([]);
  const [appDomain, setAppDomain] = useState<string>();
  const [iFrameKey, setIFrameKey] = useState(Math.random());
  const [editorRows, setEditorRows] = useState(8);

  async function getSnippetFromServerAndUpdateFilesAndFolders(
    socket: Socket,
    abortController: AbortController
  ) {
    try {
      const snippetResponse = await axios.post(
        `${config.baseApiURI}/api/v1/snippet/get`,
        {
          snippetId: snippetIdParam.current,
        },
        {
          signal: abortController.signal,
        }
      );

      const result = snippetResponse.data;

      const success: boolean = result.success;

      if (success) {
        const files: IFileFolders[] = result.data.filesAndFolders || [];

        filesAndFoldersInitial.current = files;

        if (files.length) {
          // TODO: implement bulk update
          files.forEach((file) => {
            if (file.type === "file") {
              socket.emit(
                "fileInput",
                JSON.stringify({
                  name: file.name,
                  content: file.content,
                  request: "update",
                })
              );
            }
          });
        }
      } else {
        localStorage.removeItem("snippetId");
        window.location.pathname = "/";
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function saveSnippetToDB(
    files: IFileFolders[],
    abortController: AbortController
  ): Promise<string | null> {
    try {
      const snippetResponse = await axios.post(
        `${config.baseApiURI}/api/v1/snippet/save`,
        {
          filesAndFolders: files,
          snippetId: snippetIdParam.current,
        },
        {
          signal: abortController.signal,
        }
      );

      const snippetId = snippetResponse.data.snippetId;

      return snippetId || null;
    } catch (error) {
      console.log(error);

      return null;
    }
  }

  function watchContainerFileChangesAndUpdateItOnDB(
    socket: Socket,
    abortController: AbortController
  ) {
    try {
      socket.on("fileOutputWithContent", async (jsonData: string) => {
        const parsed = JSON.parse(jsonData);
        const files: IFileFolders[] = parsed.filesAndFolders || [];

        const snippetId = await saveSnippetToDB(files, abortController);

        setFilesAndFolders(
          files.map((file) => {
            delete file.content;
            return { ...file };
          })
        );

        if (snippetId) {
          localStorage.setItem("snippetId", snippetId);

          if (snippetIdParam.current !== snippetId) {
            navigate(`/${snippetId}`);
          }
        }
      });

      socket.emit("fileInput", JSON.stringify({ request: "lswithcontent" }));

      socket.on("fileWatcher", async (jsonData: string) => {
        socket.emit("fileInput", JSON.stringify({ request: "lswithcontent" }));
      });

      socket.on("fileOutput", () => {
        socket.emit("fileInput", JSON.stringify({ request: "lswithcontent" }));
      });
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const baseSocket = io(config.baseSocketURI);

    baseSocket.emit("request", "create");

    baseSocket.on("response", (data: string) => {
      const response = JSON.parse(data);

      const appD = response.appDomain;
      const apiD = response.apiDomain;

      const constainerSocket = io(apiD);

      setAppDomain(appD);
      setContainerSocket(constainerSocket);
    });

    return () => {
      baseSocket.removeAllListeners();
      baseSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    const abortController: AbortController = new AbortController();

    if (containerSocket) {
      getSnippetFromServerAndUpdateFilesAndFolders(
        containerSocket,
        abortController
      );

      watchContainerFileChangesAndUpdateItOnDB(
        containerSocket,
        abortController
      );
    }

    return () => {
      containerSocket?.removeAllListeners();
      containerSocket?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerSocket]);

  function refreshOutput(delay: boolean = false) {
    if (refreshOutputTimer.current) {
      clearTimeout(refreshOutputTimer.current);
    }

    if (delay) {
      refreshOutputTimer.current = setTimeout(() => {
        setIFrameKey(Math.random());
      }, 5000);
    } else {
      setIFrameKey(Math.random());
    }
  }

  return (
    <div className={styles.windowContainer}>
      <ReflexContainer orientation="horizontal">
        <ReflexElement>
          <ReflexContainer orientation="vertical">
            <ReflexElement minSize={50} flex={0.28}>
              <SideBar
                setCurrentFilePath={setCurrentFilePath}
                containerSocket={containerSocket}
                filesAndFolders={filesAndFolders}
              />
            </ReflexElement>
            <ReflexSplitter />
            <ReflexElement flex={0.65}>
              <ReflexContainer orientation="horizontal">
                <ReflexElement flex={0.8}>
                  {currentFilePath && (
                    <CodeEditor
                      filesAndFoldersInitial={filesAndFoldersInitial}
                      refreshOutput={refreshOutput}
                      containerSocket={containerSocket}
                      currentFilePath={currentFilePath}
                    ></CodeEditor>
                  )}
                </ReflexElement>
                <ReflexSplitter />
                <ReflexElement
                  className={styles.terminalContainer}
                  minSize={90}
                  maxSize={730}
                  flex={0.2}
                  onResize={(event) => {
                    const el = event.domElement as Element;
                    const rows = Math.floor(el.clientHeight / 18);
                    setEditorRows(rows);
                  }}
                >
                  <Terminal
                    editorRows={editorRows}
                    refreshOutput={refreshOutput}
                    containerSocket={containerSocket}
                  ></Terminal>
                </ReflexElement>
              </ReflexContainer>
            </ReflexElement>
            <ReflexSplitter />
            <ReflexElement flex={0.5}>
              <CodeOutput iFrameKey={iFrameKey} src={appDomain}></CodeOutput>
            </ReflexElement>
          </ReflexContainer>
        </ReflexElement>
        <ReflexSplitter />
        <ReflexElement maxSize={60} minSize={60}>
          <Footer></Footer>
        </ReflexElement>
      </ReflexContainer>
    </div>
  );
}

export default Home;
