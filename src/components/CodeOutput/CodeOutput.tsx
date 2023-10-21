import { useEffect, useMemo, useRef, useState } from "react";
import { ICodeOutpuProps } from "../../interfaces/ICodeOutpuProps";

function CodeOutput({ iFrameKey, setIFrameKey, src }: ICodeOutpuProps) {
  const codeOutputRef = useRef<HTMLIFrameElement>(null);

  const srcToShow = useMemo(() => {
    return src ? `${src}?cacheBurst=${iFrameKey}` : undefined;
  }, [iFrameKey, src]);

  const [isReloading, setIsReloading] = useState(true);

  useEffect(() => {
    if (!srcToShow) return;

    const reloadIframe = async () => {
      try {
        const response = await fetch(srcToShow);
        if (response.status === 200) {
          setIFrameKey(Math.random());
          setIsReloading(false);
        } else {
          setIFrameKey(Math.random());
        }
      } catch (error) {
        // ok
      }
    };

    if (isReloading) {
      reloadIframe();

      const reloadInterval = setInterval(reloadIframe, 2000);

      return () => {
        clearInterval(reloadInterval);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [srcToShow, isReloading]);

  return (
    <div className="h-full w-full bg-white">
      {srcToShow && !isReloading ? (
        <>
          <div className="flex items-center justify-between bg-black text-xs px-2 py-1">
            <p>Facing issues?</p>
            <button
              className="bg-gray-700 text-white px-3 py-1 rounded"
              onClick={() => {
                setIFrameKey(Math.random());
              }}
            >
              Reload
            </button>
          </div>
          <iframe
            key={iFrameKey}
            name={iFrameKey.toString()}
            ref={codeOutputRef}
            className="w-full h-full"
            title="Output"
            src={srcToShow}
          />
        </>
      ) : (
        <div className="text-black">
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
}

export default CodeOutput;
