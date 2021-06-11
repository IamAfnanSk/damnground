import { useContext, useEffect, useRef } from "react";
import { Terminal as XTerminal } from "xterm";
import SocketContext from "../../contexts/SocketContext";

import styles from "./styles.module.scss";

function Terminal() {
  const terminalDivRef = useRef<HTMLDivElement>(null);
  const terminal = new XTerminal({ rows: 10 });

  const socket = useContext(SocketContext);

  terminal.setOption("theme", {
    background: "#16191d",
    foreground: "#F5F8FA",
  });

  useEffect(() => {
    socket.on("output", (data) => {
      terminal.write(data);
    });

    terminal.open(terminalDivRef.current!);

    terminal.onData((data) => {
      socket.emit("input", data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div className={styles.terminal} ref={terminalDivRef}></div>;
}

export default Terminal;
