import styles from "./styles.module.scss";

// import CodeEditor from "../../components/CodeEditor/CodeEditor";

import { ReflexContainer, ReflexSplitter, ReflexElement } from "react-reflex";
import SideBar from "../../components/SideBar/SideBar";
import CondingSectionContextProvider from "../../store/CodingSectionContext/CodingSectionContext";

function Home() {
  return (
    <div className={styles.windowContainer}>
      <ReflexContainer orientation="horizontal">
        <CondingSectionContextProvider>
          <ReflexElement>
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

              <ReflexElement flex={0.5}></ReflexElement>
            </ReflexContainer>
          </ReflexElement>
        </CondingSectionContextProvider>

        <ReflexSplitter />

        <ReflexElement maxSize={60} minSize={60}></ReflexElement>
      </ReflexContainer>
    </div>
  );
}

export default Home;
