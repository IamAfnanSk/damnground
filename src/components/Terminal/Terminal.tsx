import { useState } from "react";
import { useEffect, useRef } from "react";
import { Terminal as XTerminal } from "xterm";
import { ITerminalProps } from "../../interfaces/ITerminalProps";

import styles from "./styles.module.scss";

function Terminal(props: ITerminalProps) {
  const terminalDivRef = useRef<HTMLDivElement>(null);

  const [terminal] = useState(
    new XTerminal({
      rows: props.editorRows,
      cursorBlink: true,
    })
  );

  terminal.setOption("theme", {
    background: "#16191d",
    foreground: "#F5F8FA",
  });

  terminal.onData(() => {
    props.refreshOutput(true);
  });

  useEffect(() => {
    terminal.resize(60, props.editorRows);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.editorRows]);

  useEffect(() => {
    const socket = props.socket;

    if (socket) {
      terminal.open(terminalDivRef.current!);

      socket.on("output", (data) => {
        terminal.write(data);
      });

      terminal.onData((data) => {
        socket!.emit("input", data);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.socket]);

  return (
    <div className={styles.terminal} ref={terminalDivRef}>
      {!props.socket && "Connecting to server PLEASE WAIT 😉  ..."}
    </div>
  );
}

export default Terminal;
