import { useState } from "react";
import SideBarContent from "../SideBarContent/SideBarContent";
import SideBarOptions from "../SideBarOptions/SideBarOptions";

import styles from "./styles.module.scss";

const SideBar = (props: any) => {
  const [option, setOption] = useState("files");

  const onOptionChange = (option: string) => {
    setOption(option);
  };

  function changeCurrentFile(data: any) {
    props.changeCurrentFile(data);
  }

  return (
    <>
      <div className={styles.container}>
        <SideBarOptions onOptionChange={onOptionChange} option={option} />
        <div className="flex-1">
          <SideBarContent
            changeCurrentFile={changeCurrentFile}
            option={option}
          />
        </div>
      </div>
    </>
  );
};

export default SideBar;
