import { ISideBarContentProps } from "../../types/ISideBarContentProps";
import SideBarAbout from "../SideBarContents/SideBarAbout/SideBarAbout";
import SideBarFiles from "../SideBarContents/SideBarFiles/SideBarFiles";

import styles from "./styles.module.scss";

function SideBarContent(props: ISideBarContentProps) {
  return (
    <>
      <div className={styles.container}>
        {props.option === "about" && <SideBarAbout />}
        {props.option === "files" && <SideBarFiles />}
      </div>
    </>
  );
}

export default SideBarContent;
