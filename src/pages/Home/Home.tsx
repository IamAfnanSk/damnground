import styles from "./styles.module.scss";

import { ReflexContainer, ReflexSplitter, ReflexElement } from "react-reflex";
import SideBar from "../../components/SideBar/SideBar";

import { io, Socket } from "socket.io-client";
import { useEffect } from "react";
import { useState } from "react";
import SocketContext from "../../contexts/SocketContext";

function Home() {
  const [socket, setSocket] = useState<Socket>(io());

  useEffect(() => {
    // call api to create new container
    // from res create socket io client
    const socket = io("damner.dns.codedamn.afnanshaikh.com");
    setSocket(socket);
  }, []);

  return (
    <div className={styles.windowContainer}>
      <ReflexContainer orientation="horizontal">
        <ReflexElement>
          <SocketContext.Provider value={socket}>
            <ReflexContainer orientation="vertical">
              <ReflexElement minSize={50} flex={0.28}>
                <SideBar />
              </ReflexElement>

              <ReflexSplitter />

              <ReflexElement flex={0.65}>
                <ReflexContainer orientation="horizontal">
                  <ReflexElement flex={0.8}></ReflexElement>

                  <ReflexSplitter />

                  <ReflexElement
                    minSize={80}
                    maxSize={730}
                    flex={0.2}
                  ></ReflexElement>
                </ReflexContainer>
              </ReflexElement>

              <ReflexSplitter />

              <ReflexElement flex={0.5}>
                {/* Terminal */}
                {/* TODO: background-color: #16191d; */}
              </ReflexElement>
            </ReflexContainer>
          </SocketContext.Provider>
        </ReflexElement>

        <ReflexSplitter />

        <ReflexElement maxSize={60} minSize={60}></ReflexElement>
      </ReflexContainer>
    </div>
  );
}

export default Home;
