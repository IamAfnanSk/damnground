import styles from "./styles.module.scss";

function SideBarFiles() {
  return (
    <>
      <div
        className={
          styles.container + " flex items-center justify-between w-full p-2"
        }
      >
        <p className="text-xs font-bold">FILES</p>
        <div className="codicon codicon-new-file cursor-pointer"></div>
      </div>

      <div className="py-1 px-3">
        <div className="flex items-center cursor-pointer">
          <img
            src={`https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original.svg`}
            className="w-4"
            alt="file icon"
          />
          <p className="ml-2">index.html</p>
        </div>
      </div>
    </>
  );
}

export default SideBarFiles;
