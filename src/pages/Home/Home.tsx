import styles from "./styles.module.scss";

// import CodeEditor from "../../components/CodeEditor/CodeEditor";

import { ReflexContainer, ReflexSplitter, ReflexElement } from "react-reflex";
import SideBar from "../../components/SideBar/SideBar";

function Home() {
  return (
    <div className={styles.windowContainer}>
      <ReflexContainer orientation="horizontal">
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

            <ReflexElement flex={0.5}>
              {/* Terminal */}
              {/* TODO: background-color: #16191d; */}
            </ReflexElement>
          </ReflexContainer>
        </ReflexElement>

        <ReflexSplitter />

        <ReflexElement maxSize={60} minSize={60}></ReflexElement>
      </ReflexContainer>
    </div>
  );
}

export default Home;
