import { ISideBarOptionsProps } from "../../types/ISideBarOptionsProps";
import styles from "./styles.module.scss";

const SideBarOptions = (props: ISideBarOptionsProps) => {
  return (
    <div className={styles.container}>
      <div
        className={`${styles.option} ${
          props.option === "about" ? styles.optionSelected : ""
        }`}
        onClick={() => props.onOptionChange("about")}
      >
        <img
          src="https://codedamn.com/_next/image?url=%2Fassets%2Fimages%2Fwhite-logo.png&w=32&q=75"
          alt="Codedamn logo"
          className="h-12 mx-auto px-1 py-1"
        />
      </div>
      <div
        className={`${styles.option} ${
          props.option === "files" ? styles.optionSelected : ""
        }`}
        onClick={() => props.onOptionChange("files")}
      >
        <div className={styles.icon + " codicon codicon-files"}></div>
      </div>
    </div>
  );
};

export default SideBarOptions;
