import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { config } from "../../config/config";
import styles from "./styles.module.scss";

import { ReflexContainer, ReflexSplitter, ReflexElement } from "react-reflex";
import SideBar from "../../components/SideBar/SideBar";

import Terminal from "../../components/Terminal/Terminal";
import CodeOutput from "../../components/CodeOutput/CodeOutput";
import CodeEditor from "../../components/CodeEditor/CodeEditor";
import Footer from "../../components/Footer/Footer";
import { IFilesAndFolders } from "../../interfaces/IFilesAndFolders";
import { useHistory, useParams } from "react-router-dom";

function Home() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [appDomain, setAppDomain] = useState<string>();
  const [filesAndFolders, setFilesAndFolders] = useState<IFilesAndFolders[]>(
    []
  );

  const [currentFile, setCurrentFile] = useState<string>("");
  const [currentFileContent, setCurrentFileContent] = useState<string>("");
  const [currentFileLanguage, setCurrentFileLanguage] = useState<string>("");
  const [iFrameKey, setIFrameKey] = useState(Math.random());

  const history = useHistory();
  const params: { id: string } = useParams();

  let timer: any;

  useEffect(() => {
    const baseSocket = io(config.baseSocketURI);

    baseSocket.on("response", (data: string) => {
      const response = JSON.parse(data);
      const { appDomain, apiDomain } = response;
      const mainSocket = io(apiDomain);
      setSocket(mainSocket);
      setAppDomain(appDomain);
    });

    baseSocket.emit("request", "create");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (socket) {
      const snippetIdLocal = params.id;

      if (snippetIdLocal) {
        getAndUpdateFilesAndFolders(snippetIdLocal);
      } else {
        saveSnippetToserverAndSetIdToLocalstorage();
      }

      socket.on("fileOutputWithContent", (data) => {
        const parsed = JSON.parse(data);
        const fAndFolders = parsed.filesAndFolders;

        setFilesAndFolders(fAndFolders);

        fetch(`${config.baseApiURI}/api/v1/snippet/save`, {
          method: "post",
          body: JSON.stringify({
            files: fAndFolders,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((data) => {
            history.push(`/${data.snippetId}`);
          })
          .catch((error) => {});
      });

      socket.on("fileOutput", () => {
        socket.emit(
          "fileInput",
          JSON.stringify({
            request: "lswithcontent",
          })
        );
      });
    }

    function saveSnippetToserverAndSetIdToLocalstorage() {
      socket!.emit("fileInput", JSON.stringify({ request: "lswithcontent" }));
    }

    function getAndUpdateFilesAndFolders(snippetId: string) {
      fetch(`${config.baseApiURI}/api/v1/snippet/get`, {
        method: "post",
        body: JSON.stringify({
          snippetId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then(({ data }) => {
          const files = data.files;

          files.forEach((file: any) => {
            if (file.type === "file") {
              socket!.emit(
                "fileInput",
                JSON.stringify({
                  name: file.name,
                  content: file.content,
                  request: "update",
                })
              );
            }
          });

          setFilesAndFolders(files);
        })
        .catch((error) => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  function updateCurrentFile(file: string) {
    const currFile = filesAndFolders.find((f) => {
      return f.name === file;
    });

    if (currFile) {
      setCurrentFile(file);

      const splitted = file.split(".");
      const extension = splitted[splitted.length - 1];

      setCurrentFileContent(currFile.content);

      switch (extension) {
        case "js":
          setCurrentFileLanguage("javascript");
          break;
        case "ts":
          setCurrentFileLanguage("typescript");
          break;
        case "html":
          setCurrentFileLanguage("html");
          break;
        case "css":
          setCurrentFileLanguage("css");
          break;
        default:
          setCurrentFileLanguage("typescript");
          break;
      }
    }
  }

  function updateFile(value: string) {
    const file = filesAndFolders.find((file) => file.name === currentFile);

    if (file) {
      file.content = value;
    }
  }

  function refreshOutput(delay: boolean = false) {
    if (timer) {
      clearTimeout(timer);
    }

    if (delay) {
      timer = setTimeout(() => {
        setIFrameKey(Math.random());
      }, 5000);
    } else {
      setIFrameKey(Math.random());
    }
  }

  function addFile(file: any) {
    const fAndFolders = filesAndFolders;
    fAndFolders.push(file);

    setFilesAndFolders(fAndFolders);
  }

  return (
    <div className={styles.windowContainer}>
      <ReflexContainer orientation="horizontal">
        <ReflexElement>
          <ReflexContainer orientation="vertical">
            <ReflexElement minSize={50} flex={0.28}>
              <SideBar
                addFile={addFile}
                updateCurrentFile={updateCurrentFile}
                socket={socket}
              />
            </ReflexElement>
            <ReflexSplitter />
            <ReflexElement flex={0.65}>
              <ReflexContainer orientation="horizontal">
                <ReflexElement flex={0.8}>
                  {currentFile && (
                    <CodeEditor
                      refreshOutput={refreshOutput}
                      updateFile={updateFile}
                      socket={socket}
                      currentFileContent={currentFileContent}
                      currentFileLanguage={currentFileLanguage}
                      currentFile={currentFile}
                    ></CodeEditor>
                  )}
                </ReflexElement>
                <ReflexSplitter />
                <ReflexElement
                  className={styles.terminalContainer}
                  minSize={80}
                  maxSize={730}
                  flex={0.2}
                >
                  <Terminal
                    refreshOutput={refreshOutput}
                    socket={socket}
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
