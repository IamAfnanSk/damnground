import SideBarOptions from "../SideBarOptions/SideBarOptions";

import styles from "./styles.module.scss";

const SideBar = () => {
  return (
    <div className={styles.container}>
      <SideBarOptions />
      <div></div>
    </div>
  );
};

export default SideBar;
