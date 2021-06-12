import { useRef } from "react";

function CodeOutput(props: any) {
  const codeOutputRef = useRef<HTMLIFrameElement>(null);
  return (
    <div className="h-full w-full bg-white">
      <iframe
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
