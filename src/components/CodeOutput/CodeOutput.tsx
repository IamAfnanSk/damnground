import { useRef } from "react";
import { ICodeOutpuProps } from "../../interfaces/ICodeOutpuProps";

function CodeOutput(props: ICodeOutpuProps) {
  const codeOutputRef = useRef<HTMLIFrameElement>(null);
  return (
    <div className="h-full w-full bg-white">
      <iframe
        key={props.iFrameKey}
        ref={codeOutputRef}
        className="w-full h-full"
        title="Output"
        src={props.src}
        frameBorder="0"
      ></iframe>
    </div>
  );
}

export default CodeOutput;
