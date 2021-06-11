import styles from "./styles.module.scss";

import { ReflexContainer, ReflexSplitter, ReflexElement } from "react-reflex";
import SideBar from "../../components/SideBar/SideBar";

import { io, Socket } from "socket.io-client";
import { useEffect } from "react";
import { useState } from "react";
import SocketContext from "../../contexts/SocketContext";
import Terminal from "../../components/Terminal/Terminal";
import CodeOutput from "../../components/CodeOutput/CodeOutput";
import CodeEditor from "../../components/CodeEditor/CodeEditor";

function Home() {
  const [socket, setSocket] = useState<Socket>(io());
  const [currentFile, setCurrentFile] = useState("index.html");

  useEffect(() => {
    // call api to create new container
    // from res create socket io client
    const socket = io("damner.dns.codedamn.afnanshaikh.com");
    setSocket(socket);
  }, []);

  function changeCurrentFile(data: any) {
    setCurrentFile(data.name);
  }

  return (
    <div className={styles.windowContainer}>
      <ReflexContainer orientation="horizontal">
        <ReflexElement>
          <SocketContext.Provider value={socket}>
            <ReflexContainer orientation="vertical">
              <ReflexElement minSize={50} flex={0.28}>
                <SideBar changeCurrentFile={changeCurrentFile} />
              </ReflexElement>

              <ReflexSplitter />

              <ReflexElement flex={0.65}>
                <ReflexContainer orientation="horizontal">
                  <ReflexElement flex={0.8}>
                    <CodeEditor currentFile={currentFile}></CodeEditor>
                  </ReflexElement>

                  <ReflexSplitter />

                  <ReflexElement
                    className={styles.terminalContainer}
                    minSize={80}
                    maxSize={730}
                    flex={0.2}
                  >
                    <Terminal></Terminal>
                  </ReflexElement>
                </ReflexContainer>
              </ReflexElement>

              <ReflexSplitter />

              <ReflexElement flex={0.5}>
                {/* TODO: Pass src */}
                <CodeOutput src="http://app.damner.dns.codedamn.afnanshaikh.com"></CodeOutput>
              </ReflexElement>
            </ReflexContainer>
          </SocketContext.Provider>
        </ReflexElement>

        <ReflexSplitter />

        <ReflexElement maxSize={60} minSize={60}>
          <div className="px-6 py-1 flex items-center justify-between">
            <div>
              <p>
                After so much backend work, I had no time to fix memory leaks
                and improvments 😞 but <b>something is better than nothing</b>{" "}
                👍
              </p>
              <p>
                😍
                <b> Features Implemented:</b> Multiple resizable windows,
                Textmate grammers, Real CLI, Multi file monaco editor, Real
                output, File management, File listing, File saving to DB, etc.
              </p>
            </div>
            <div>
              <img
                src="/assets/logo.jpg"
                className="w-10"
                alt="Afnan Shaikh's Logo"
              />
            </div>
          </div>
        </ReflexElement>
      </ReflexContainer>
    </div>
  );
}

export default Home;
