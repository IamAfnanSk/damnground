import { createContext, useState } from "react";
import { ICodingSectionContext, File } from "../../types/ICodingSectionContext";

const CondingSectionContext = createContext<ICodingSectionContext>({
  files: [],
});

function CondingSectionContextProvider(props: any) {
  const [files, setFiles] = useState<File[]>([]);

  const context: ICodingSectionContext = {
    files: [],
  };

  (async () => {})();

  return (
    <CondingSectionContext.Provider value={context}>
      {props.children}
    </CondingSectionContext.Provider>
  );
}

export default CondingSectionContextProvider;
