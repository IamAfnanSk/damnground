import { ISideBarContentProps } from "../../types/ISideBarContentProps";
import SideBarAbout from "../SideBarContents/SideBarAbout/SideBarAbout";
import SideBarFiles from "../SideBarContents/SideBarFiles/SideBarFiles";

import styles from "./styles.module.scss";

function SideBarContent(props: ISideBarContentProps) {
  function changeCurrentFile(data: any) {
    props.changeCurrentFile(data);
  }

  return (
    <>
      <div className={styles.container}>
        {props.option === "about" && <SideBarAbout />}
        {props.option === "files" && (
          <SideBarFiles changeCurrentFile={changeCurrentFile} />
        )}
      </div>
    </>
  );
}

export default SideBarContent;
