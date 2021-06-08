import Editor, { Monaco, useMonaco } from "@monaco-editor/react";
import { ICodeEditorProps } from "../../types/ICodeEditorProps";
import { Registry } from "monaco-textmate";
import { useEffect, useRef, useState } from "react";
import { wireTmGrammars } from "monaco-editor-textmate";
import { supportedLanguages } from "../../constants/supportedLanguages";

const registry = new Registry({
  async getGrammarDefinition(scopeName) {
    const indexOfLanguage = (
      supportedLanguages as ReadonlyArray<string>
    ).indexOf(scopeName);

    console.log(indexOfLanguage);

    return {
      format: "plist",
      content: await (await fetch("/languages/TypeScript.tmLanguage")).text(),
    };
  },
});

function CodeEditor(props: ICodeEditorProps) {
  const editorRef = useRef<any | null>(null);
  const monaco = useMonaco();

  const [fileName, setFileName] = useState("script.js");

  // const file = files[fileName];

  useEffect(() => {
    if (monaco) {
      console.log(monaco.editor);
    }
  }, [monaco]);

  const liftOff = async (editor: any, monaco: Monaco) => {
    const grammars = new Map();

    monaco.languages.register({ id: "javascript" });
    monaco.languages.register({ id: "typescript" });

    grammars.set("javascript", "source.js");
    grammars.set("typescript", "source.ts");

    // monaco.editor.defineTheme("vs-code-theme-converted", {});

    setTimeout(async () => {
      await wireTmGrammars(monaco, registry, grammars, editor);
    }, 1);
  };

  const editorOnMount = (editor: any, monaco: Monaco) => {
    // monacoRef.current = monaco;
    editorRef.current = editor;

    // liftOff(editorRef.current, monacoRef.current);
  };

  const editorOnChange = (value: string | undefined, event: any) => {
    console.log(value);
  };

  return (
    <>
      <Editor
        onMount={editorOnMount}
        onChange={editorOnChange}
        height="80vh"
        theme="vs-dark"
        // path={file.name}
        // defaultLanguage={file.language}
        // defaultValue={file.value}
        // height={"95vh"}
        // language={"typescript"}
        // theme={"vs-code-theme-converted"}
      />
    </>
  );
}

export default CodeEditor;
