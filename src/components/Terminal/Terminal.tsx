import { useContext, useEffect, useMemo, useRef } from "react";
import { Terminal as XTerminal } from "xterm";
import SocketContext from "../../contexts/SocketContext";
import { ITerminalProps } from "../../types/ITerminalProps";

import styles from "./styles.module.scss";

function Terminal(props: ITerminalProps) {
  const terminalDivRef = useRef<HTMLDivElement>(null);
  const terminal = useMemo(() => new XTerminal({ rows: 10 }), []);

  const socket = useContext(SocketContext);

  terminal.setOption("theme", {
    background: "#16191d",
    foreground: "#F5F8FA",
  });

  useEffect(() => {
    if (props.terminalResizeEvent) {
      const element = props.terminalResizeEvent.domElement as Element;
      const rows = Math.floor(element.clientHeight / 18);

      terminal.resize(50, rows);
    }
  }, [props.terminalResizeEvent, terminal]);

  useEffect(() => {
    terminal.open(terminalDivRef.current!);

    terminal.onData((data) => {
      socket.emit("input", data);
    });

    socket.on("output", (data) => {
      terminal.write(data);
    });
  }, [terminal, socket]);

  return <div className={styles.terminal} ref={terminalDivRef}></div>;
}

export default Terminal;
