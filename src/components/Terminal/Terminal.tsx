import { useEffect, useRef } from "react";
import { Terminal as XTerminal } from "xterm";
import { ITerminalProps } from "../../interfaces/ITerminalProps";

import styles from "./styles.module.scss";

function Terminal({
  editorRows,
  refreshOutput,
  containerSocket,
}: ITerminalProps) {
  const terminalDivRef = useRef<HTMLDivElement>(null);

  const terminal = useRef(
    new XTerminal({
      rows: editorRows,
      cursorBlink: true,
      theme: {
        background: "#16191d",
        foreground: "#F5F8FA",
      },
    })
  );

  useEffect(() => {
    const onDataListerner = terminal.current.onData(() => {
      refreshOutput(true);
    });

    return () => {
      onDataListerner.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    terminal.current.resize(60, editorRows);
  }, [editorRows]);

  useEffect(() => {
    terminal.current.open(terminalDivRef.current!);

    containerSocket?.on("output", (data) => {
      terminal.current.write(data);
    });

    const onDataListerner = terminal.current.onData((data) => {
      containerSocket?.emit("input", data);
    });

    return () => {
      onDataListerner.dispose();
    };
  }, [containerSocket]);

  return (
    <div className={styles.terminal} ref={terminalDivRef}>
      {!containerSocket && "Connecting to server PLEASE WAIT 😉  ..."}
    </div>
  );
}

export default Terminal;
