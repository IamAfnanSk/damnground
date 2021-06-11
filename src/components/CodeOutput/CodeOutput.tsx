import { useRef } from "react";

function CodeOutput(props: any) {
  const codeOutputRef = useRef<HTMLIFrameElement>(null);

  return (
    <div className="h-full w-full bg-white">
      <h3 className="bg-yellow-900 py-2 px-6 rounded-md absolute bottom-2">
        Type 'static-server' in terminal and reload this frame, <b>please</b>
      </h3>
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
