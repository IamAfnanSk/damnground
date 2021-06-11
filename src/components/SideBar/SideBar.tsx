import { useState } from "react";
import SideBarContent from "../SideBarContent/SideBarContent";
import SideBarOptions from "../SideBarOptions/SideBarOptions";

import styles from "./styles.module.scss";

const SideBar = () => {
  const [option, setOption] = useState("files");

  const onOptionChange = (option: string) => {
    setOption(option);
  };

  return (
    <>
      <div className={styles.container}>
        <SideBarOptions onOptionChange={onOptionChange} option={option} />
        <div className="flex-1">
          <SideBarContent option={option} />
        </div>
      </div>
    </>
  );
};

export default SideBar;
