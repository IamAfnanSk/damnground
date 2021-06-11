import styles from "./styles.module.scss";

function SideBarAbout() {
  return (
    <div className={styles.container}>
      <h2 className="text-xl font-bold">About coding ground</h2>
      <p className="mt-3 font-light">
        This interface helps you code in browser and see the immediate output.
        Complete the challenges mentioned and proceed forward with the next
        ones!
      </p>
    </div>
  );
}

export default SideBarAbout;
