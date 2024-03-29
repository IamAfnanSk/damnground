import { Registry } from "monaco-textmate";
import { useCallback, useRef } from "react";
import { wireTmGrammars } from "monaco-editor-textmate";
import { ICodeEditorProps } from "../../interfaces/ICodeEditorProps";
import { useEffect } from "react";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { getFileLanguageFromPath } from "../../utils/getFileLanguageFromPath";
import { IFileFolders } from "../../interfaces/IFileFolders";

type TMonaco = typeof monaco;

function CodeEditor({
  currentFilePath,
  refreshOutput,
  containerSocket,
  filesAndFoldersInitial,
}: ICodeEditorProps) {
  const editorDivRef = useRef<HTMLDivElement | null>(null);

  const editor = useRef<monaco.editor.ICodeEditor | null>(null);

  const registry = useCallback(
    () =>
      new Registry({
        async getGrammarDefinition(scopeName) {
          if (scopeName === "source.ts") {
            return {
              format: "json",
              content: await (
                await fetch("/languages/TypeScript.tmLanguage.json")
              ).text(),
            };
          }

          if (scopeName === "source.js") {
            return {
              format: "json",
              content: await (
                await fetch("/languages/javaScript.tmLanguage.json")
              ).text(),
            };
          }

          if (scopeName === "source.html" || scopeName === "text.html.basic") {
            return {
              format: "json",
              content: await (
                await fetch("/languages/html.tmLanguage.json")
              ).text(),
            };
          }

          if (scopeName === "source.css") {
            return {
              format: "json",
              content: await (
                await fetch("/languages/css.tmLanguage.json")
              ).text(),
            };
          }

          return {
            format: "json",
            content: await (
              await fetch("/languages/TypeScript.tmLanguage.json")
            ).text(),
          };
        },
      }),
    []
  );

  const tokenize = useCallback(
    async (editor: monaco.editor.ICodeEditor, monaco: TMonaco) => {
      const grammars = new Map<string, string>();

      monaco.languages.register({ id: "javascript" });
      monaco.languages.register({ id: "typescript" });
      monaco.languages.register({ id: "html" });
      monaco.languages.register({ id: "css" });

      grammars.set("javascript", "source.js");
      grammars.set("typescript", "source.ts");
      grammars.set("html", "source.html");
      grammars.set("css", "source.css");

      monaco.editor.defineTheme("tm-compatible-theme", {
        inherit: false,
        base: "vs-dark",
        colors: {
          focusBorder: "#1f6feb",
          foreground: "#e6edf3",
          descriptionForeground: "#7d8590",
          errorForeground: "#f85149",
          "textLink.foreground": "#2f81f7",
          "textLink.activeForeground": "#2f81f7",
          "textBlockQuote.background": "#010409",
          "textBlockQuote.border": "#30363d",
          "textCodeBlock.background": "#6e768166",
          "textPreformat.foreground": "#7d8590",
          "textSeparator.foreground": "#21262d",
          "icon.foreground": "#7d8590",
          "keybindingLabel.foreground": "#e6edf3",
          "button.background": "#238636",
          "button.foreground": "#ffffff",
          "button.hoverBackground": "#2ea043",
          "button.secondaryBackground": "#282e33",
          "button.secondaryForeground": "#c9d1d9",
          "button.secondaryHoverBackground": "#30363d",
          "checkbox.background": "#161b22",
          "checkbox.border": "#30363d",
          "dropdown.background": "#161b22",
          "dropdown.border": "#30363d",
          "dropdown.foreground": "#e6edf3",
          "dropdown.listBackground": "#161b22",
          "input.background": "#0d1117",
          "input.border": "#30363d",
          "input.foreground": "#e6edf3",
          "input.placeholderForeground": "#6e7681",
          "badge.foreground": "#ffffff",
          "badge.background": "#1f6feb",
          "progressBar.background": "#1f6feb",
          "titleBar.activeForeground": "#7d8590",
          "titleBar.activeBackground": "#0d1117",
          "titleBar.inactiveForeground": "#7d8590",
          "titleBar.inactiveBackground": "#010409",
          "titleBar.border": "#30363d",
          "activityBar.foreground": "#e6edf3",
          "activityBar.inactiveForeground": "#7d8590",
          "activityBar.background": "#0d1117",
          "activityBarBadge.foreground": "#ffffff",
          "activityBarBadge.background": "#1f6feb",
          "activityBar.activeBorder": "#f78166",
          "activityBar.border": "#30363d",
          "sideBar.foreground": "#e6edf3",
          "sideBar.background": "#010409",
          "sideBar.border": "#30363d",
          "sideBarTitle.foreground": "#e6edf3",
          "sideBarSectionHeader.foreground": "#e6edf3",
          "sideBarSectionHeader.background": "#010409",
          "sideBarSectionHeader.border": "#30363d",
          "list.hoverForeground": "#e6edf3",
          "list.inactiveSelectionForeground": "#e6edf3",
          "list.activeSelectionForeground": "#e6edf3",
          "list.hoverBackground": "#6e76811a",
          "list.inactiveSelectionBackground": "#6e768166",
          "list.activeSelectionBackground": "#6e768166",
          "list.focusForeground": "#e6edf3",
          "list.focusBackground": "#388bfd26",
          "list.inactiveFocusBackground": "#388bfd26",
          "list.highlightForeground": "#2f81f7",
          "tree.indentGuidesStroke": "#21262d",
          "notificationCenterHeader.foreground": "#7d8590",
          "notificationCenterHeader.background": "#161b22",
          "notifications.foreground": "#e6edf3",
          "notifications.background": "#161b22",
          "notifications.border": "#30363d",
          "notificationsErrorIcon.foreground": "#f85149",
          "notificationsWarningIcon.foreground": "#d29922",
          "notificationsInfoIcon.foreground": "#2f81f7",
          "pickerGroup.border": "#30363d",
          "pickerGroup.foreground": "#7d8590",
          "quickInput.background": "#161b22",
          "quickInput.foreground": "#e6edf3",
          "statusBar.foreground": "#7d8590",
          "statusBar.background": "#0d1117",
          "statusBar.border": "#30363d",
          "statusBar.focusBorder": "#1f6feb80",
          "statusBar.noFolderBackground": "#0d1117",
          "statusBar.debuggingForeground": "#ffffff",
          "statusBar.debuggingBackground": "#da3633",
          "statusBarItem.prominentBackground": "#6e768166",
          "statusBarItem.remoteForeground": "#e6edf3",
          "statusBarItem.remoteBackground": "#30363d",
          "statusBarItem.hoverBackground": "#e6edf314",
          "statusBarItem.activeBackground": "#e6edf31f",
          "statusBarItem.focusBorder": "#1f6feb",
          "editorGroupHeader.tabsBackground": "#010409",
          "editorGroupHeader.tabsBorder": "#30363d",
          "editorGroup.border": "#30363d",
          "tab.activeForeground": "#e6edf3",
          "tab.inactiveForeground": "#7d8590",
          "tab.inactiveBackground": "#010409",
          "tab.activeBackground": "#0d1117",
          "tab.hoverBackground": "#0d1117",
          "tab.unfocusedHoverBackground": "#6e76811a",
          "tab.border": "#30363d",
          "tab.unfocusedActiveBorderTop": "#30363d",
          "tab.activeBorder": "#0d1117",
          "tab.unfocusedActiveBorder": "#0d1117",
          "tab.activeBorderTop": "#f78166",
          "breadcrumb.foreground": "#7d8590",
          "breadcrumb.focusForeground": "#e6edf3",
          "breadcrumb.activeSelectionForeground": "#7d8590",
          "breadcrumbPicker.background": "#161b22",
          "editor.foreground": "#e6edf3",
          "editor.background": "#0d1117",
          "editorWidget.background": "#161b22",
          "editor.foldBackground": "#6e76811a",
          "editor.lineHighlightBackground": "#6e76811a",
          "editorLineNumber.foreground": "#6e7681",
          "editorLineNumber.activeForeground": "#e6edf3",
          "editorIndentGuide.background": "#e6edf31f",
          "editorIndentGuide.activeBackground": "#e6edf33d",
          "editorWhitespace.foreground": "#484f58",
          "editorCursor.foreground": "#2f81f7",
          "editor.findMatchBackground": "#9e6a03",
          "editor.findMatchHighlightBackground": "#f2cc6080",
          "editor.linkedEditingBackground": "#2f81f712",
          "editor.selectionHighlightBackground": "#3fb95040",
          "editor.wordHighlightBackground": "#6e768180",
          "editor.wordHighlightBorder": "#6e768199",
          "editor.wordHighlightStrongBackground": "#6e76814d",
          "editor.wordHighlightStrongBorder": "#6e768199",
          "editorBracketMatch.background": "#3fb95040",
          "editorBracketMatch.border": "#3fb95099",
          "editorInlayHint.background": "#8b949e33",
          "editorInlayHint.foreground": "#7d8590",
          "editorInlayHint.typeBackground": "#8b949e33",
          "editorInlayHint.typeForeground": "#7d8590",
          "editorInlayHint.paramBackground": "#8b949e33",
          "editorInlayHint.paramForeground": "#7d8590",
          "editorGutter.modifiedBackground": "#bb800966",
          "editorGutter.addedBackground": "#2ea04366",
          "editorGutter.deletedBackground": "#f8514966",
          "diffEditor.insertedLineBackground": "#23863626",
          "diffEditor.insertedTextBackground": "#3fb9504d",
          "diffEditor.removedLineBackground": "#da363326",
          "diffEditor.removedTextBackground": "#ff7b724d",
          "scrollbar.shadow": "#484f5833",
          "scrollbarSlider.background": "#8b949e33",
          "scrollbarSlider.hoverBackground": "#8b949e3d",
          "scrollbarSlider.activeBackground": "#8b949e47",
          "editorOverviewRuler.border": "#010409",
          "minimapSlider.background": "#8b949e33",
          "minimapSlider.hoverBackground": "#8b949e3d",
          "minimapSlider.activeBackground": "#8b949e47",
          "panel.background": "#010409",
          "panel.border": "#30363d",
          "panelTitle.activeBorder": "#f78166",
          "panelTitle.activeForeground": "#e6edf3",
          "panelTitle.inactiveForeground": "#7d8590",
          "panelInput.border": "#30363d",
          "debugIcon.breakpointForeground": "#f85149",
          "debugConsole.infoForeground": "#8b949e",
          "debugConsole.warningForeground": "#d29922",
          "debugConsole.errorForeground": "#ffa198",
          "debugConsole.sourceForeground": "#e3b341",
          "debugConsoleInputIcon.foreground": "#bc8cff",
          "debugTokenExpression.name": "#79c0ff",
          "debugTokenExpression.value": "#a5d6ff",
          "debugTokenExpression.string": "#a5d6ff",
          "debugTokenExpression.boolean": "#56d364",
          "debugTokenExpression.number": "#56d364",
          "debugTokenExpression.error": "#ffa198",
          "symbolIcon.arrayForeground": "#f0883e",
          "symbolIcon.booleanForeground": "#58a6ff",
          "symbolIcon.classForeground": "#f0883e",
          "symbolIcon.colorForeground": "#79c0ff",
          "symbolIcon.constructorForeground": "#d2a8ff",
          "symbolIcon.enumeratorForeground": "#f0883e",
          "symbolIcon.enumeratorMemberForeground": "#58a6ff",
          "symbolIcon.eventForeground": "#6e7681",
          "symbolIcon.fieldForeground": "#f0883e",
          "symbolIcon.fileForeground": "#d29922",
          "symbolIcon.folderForeground": "#d29922",
          "symbolIcon.functionForeground": "#bc8cff",
          "symbolIcon.interfaceForeground": "#f0883e",
          "symbolIcon.keyForeground": "#58a6ff",
          "symbolIcon.keywordForeground": "#ff7b72",
          "symbolIcon.methodForeground": "#bc8cff",
          "symbolIcon.moduleForeground": "#ff7b72",
          "symbolIcon.namespaceForeground": "#ff7b72",
          "symbolIcon.nullForeground": "#58a6ff",
          "symbolIcon.numberForeground": "#3fb950",
          "symbolIcon.objectForeground": "#f0883e",
          "symbolIcon.operatorForeground": "#79c0ff",
          "symbolIcon.packageForeground": "#f0883e",
          "symbolIcon.propertyForeground": "#f0883e",
          "symbolIcon.referenceForeground": "#58a6ff",
          "symbolIcon.snippetForeground": "#58a6ff",
          "symbolIcon.stringForeground": "#79c0ff",
          "symbolIcon.structForeground": "#f0883e",
          "symbolIcon.textForeground": "#79c0ff",
          "symbolIcon.typeParameterForeground": "#79c0ff",
          "symbolIcon.unitForeground": "#58a6ff",
          "symbolIcon.variableForeground": "#f0883e",
          "symbolIcon.constantForeground": "#aff5b4",
          "terminal.foreground": "#e6edf3",
          "terminal.ansiBlack": "#484f58",
          "terminal.ansiRed": "#ff7b72",
          "terminal.ansiGreen": "#3fb950",
          "terminal.ansiYellow": "#d29922",
          "terminal.ansiBlue": "#58a6ff",
          "terminal.ansiMagenta": "#bc8cff",
          "terminal.ansiCyan": "#39c5cf",
          "terminal.ansiWhite": "#b1bac4",
          "terminal.ansiBrightBlack": "#6e7681",
          "terminal.ansiBrightRed": "#ffa198",
          "terminal.ansiBrightGreen": "#56d364",
          "terminal.ansiBrightYellow": "#e3b341",
          "terminal.ansiBrightBlue": "#79c0ff",
          "terminal.ansiBrightMagenta": "#d2a8ff",
          "terminal.ansiBrightCyan": "#56d4dd",
          "terminal.ansiBrightWhite": "#ffffff",
          "editorBracketHighlight.foreground1": "#79c0ff",
          "editorBracketHighlight.foreground2": "#56d364",
          "editorBracketHighlight.foreground3": "#e3b341",
          "editorBracketHighlight.foreground4": "#ffa198",
          "editorBracketHighlight.foreground5": "#ff9bce",
          "editorBracketHighlight.foreground6": "#d2a8ff",
          "editorBracketHighlight.unexpectedBracket.foreground": "#7d8590",
          "gitDecoration.addedResourceForeground": "#3fb950",
          "gitDecoration.modifiedResourceForeground": "#d29922",
          "gitDecoration.deletedResourceForeground": "#f85149",
          "gitDecoration.untrackedResourceForeground": "#3fb950",
          "gitDecoration.ignoredResourceForeground": "#6e7681",
          "gitDecoration.conflictingResourceForeground": "#db6d28",
          "gitDecoration.submoduleResourceForeground": "#7d8590",
          "debugToolBar.background": "#161b22",
          "editor.stackFrameHighlightBackground": "#bb800966",
          "editor.focusedStackFrameHighlightBackground": "#2ea04366",
          "peekViewEditor.matchHighlightBackground": "#bb800966",
          "peekViewResult.matchHighlightBackground": "#bb800966",
          "peekViewEditor.background": "#6e76811a",
          "peekViewResult.background": "#0d1117",
          "settings.headerForeground": "#e6edf3",
          "settings.modifiedItemIndicator": "#bb800966",
          "welcomePage.buttonBackground": "#21262d",
          "welcomePage.buttonHoverBackground": "#30363d",
        },
        rules: [
          {
            foreground: "#8b949e",
            token: "comment",
          },
          {
            foreground: "#8b949e",
            token: "punctuation.definition.comment",
          },
          {
            foreground: "#8b949e",
            token: "string.comment",
          },
          {
            foreground: "#ff7b72",
            token: "constant.other.placeholder",
          },
          {
            foreground: "#ff7b72",
            token: "constant.character",
          },
          {
            foreground: "#79c0ff",
            token: "constant",
          },
          {
            foreground: "#79c0ff",
            token: "entity.name.constant",
          },
          {
            foreground: "#79c0ff",
            token: "variable.other.constant",
          },
          {
            foreground: "#79c0ff",
            token: "variable.other.enummember",
          },
          {
            foreground: "#79c0ff",
            token: "variable.language",
          },
          {
            foreground: "#79c0ff",
            token: "entity",
          },
          {
            foreground: "#ffa657",
            token: "entity.name",
          },
          {
            foreground: "#ffa657",
            token: "meta.export.default",
          },
          {
            foreground: "#ffa657",
            token: "meta.definition.variable",
          },
          {
            foreground: "#e6edf3",
            token: "variable.parameter.function",
          },
          {
            foreground: "#e6edf3",
            token: "meta.jsx.children",
          },
          {
            foreground: "#e6edf3",
            token: "meta.block",
          },
          {
            foreground: "#e6edf3",
            token: "meta.tag.attributes",
          },
          {
            foreground: "#e6edf3",
            token: "entity.name.constant",
          },
          {
            foreground: "#e6edf3",
            token: "meta.object.member",
          },
          {
            foreground: "#e6edf3",
            token: "meta.embedded.expression",
          },
          {
            foreground: "#d2a8ff",
            token: "entity.name.function",
          },
          {
            foreground: "#7ee787",
            token: "entity.name.tag",
          },
          {
            foreground: "#7ee787",
            token: "support.class.component",
          },
          {
            foreground: "#ff7b72",
            token: "keyword",
          },
          {
            foreground: "#ff7b72",
            token: "storage",
          },
          {
            foreground: "#ff7b72",
            token: "storage.type",
          },
          {
            foreground: "#e6edf3",
            token: "storage.modifier.package",
          },
          {
            foreground: "#e6edf3",
            token: "storage.modifier.import",
          },
          {
            foreground: "#e6edf3",
            token: "storage.type.java",
          },
          {
            foreground: "#a5d6ff",
            token: "string",
          },
          {
            foreground: "#a5d6ff",
            token: "string punctuation.section.embedded source",
          },
          {
            foreground: "#79c0ff",
            token: "support",
          },
          {
            foreground: "#79c0ff",
            token: "meta.property-name",
          },
          {
            foreground: "#ffa657",
            token: "variable",
          },
          {
            foreground: "#e6edf3",
            token: "variable.other",
          },
          {
            fontStyle: "italic",
            foreground: "#ffa198",
            token: "invalid.broken",
          },
          {
            fontStyle: "italic",
            foreground: "#ffa198",
            token: "invalid.deprecated",
          },
          {
            fontStyle: "italic",
            foreground: "#ffa198",
            token: "invalid.illegal",
          },
          {
            fontStyle: "italic",
            foreground: "#ffa198",
            token: "invalid.unimplemented",
          },
          {
            fontStyle: "italic underline",
            background: "#ff7b72",
            foreground: "#f0f6fc",
            token: "carriage-return",
          },
          {
            foreground: "#ffa198",
            token: "message.error",
          },
          {
            foreground: "#79c0ff",
            token: "string variable",
          },
          {
            foreground: "#a5d6ff",
            token: "source.regexp",
          },
          {
            foreground: "#a5d6ff",
            token: "string.regexp",
          },
          {
            foreground: "#a5d6ff",
            token: "string.regexp.character-class",
          },
          {
            foreground: "#a5d6ff",
            token: "string.regexp constant.character.escape",
          },
          {
            foreground: "#a5d6ff",
            token: "string.regexp source.ruby.embedded",
          },
          {
            foreground: "#a5d6ff",
            token: "string.regexp string.regexp.arbitrary-repitition",
          },
          {
            fontStyle: "bold",
            foreground: "#7ee787",
            token: "string.regexp constant.character.escape",
          },
          {
            foreground: "#79c0ff",
            token: "support.constant",
          },
          {
            foreground: "#79c0ff",
            token: "support.variable",
          },
          {
            foreground: "#7ee787",
            token: "support.type.property-name.json",
          },
          {
            foreground: "#79c0ff",
            token: "meta.module-reference",
          },
          {
            foreground: "#ffa657",
            token: "punctuation.definition.list.begin.markdown",
          },
          {
            fontStyle: "bold",
            foreground: "#79c0ff",
            token: "markup.heading",
          },
          {
            fontStyle: "bold",
            foreground: "#79c0ff",
            token: "markup.heading entity.name",
          },
          {
            foreground: "#7ee787",
            token: "markup.quote",
          },
          {
            fontStyle: "italic",
            foreground: "#e6edf3",
            token: "markup.italic",
          },
          {
            fontStyle: "bold",
            foreground: "#e6edf3",
            token: "markup.bold",
          },
          {
            fontStyle: "underline",
            token: "markup.underline",
          },
          {
            fontStyle: "strikethrough",
            token: "markup.strikethrough",
          },
          {
            foreground: "#79c0ff",
            token: "markup.inline.raw",
          },
          {
            background: "#490202",
            foreground: "#ffa198",
            token: "markup.deleted",
          },
          {
            background: "#490202",
            foreground: "#ffa198",
            token: "meta.diff.header.from-file",
          },
          {
            background: "#490202",
            foreground: "#ffa198",
            token: "punctuation.definition.deleted",
          },
          {
            foreground: "#ff7b72",
            token: "punctuation.section.embedded",
          },
          {
            background: "#04260f",
            foreground: "#7ee787",
            token: "markup.inserted",
          },
          {
            background: "#04260f",
            foreground: "#7ee787",
            token: "meta.diff.header.to-file",
          },
          {
            background: "#04260f",
            foreground: "#7ee787",
            token: "punctuation.definition.inserted",
          },
          {
            background: "#5a1e02",
            foreground: "#ffa657",
            token: "markup.changed",
          },
          {
            background: "#5a1e02",
            foreground: "#ffa657",
            token: "punctuation.definition.changed",
          },
          {
            foreground: "#161b22",
            background: "#79c0ff",
            token: "markup.ignored",
          },
          {
            foreground: "#161b22",
            background: "#79c0ff",
            token: "markup.untracked",
          },
          {
            foreground: "#d2a8ff",
            fontStyle: "bold",
            token: "meta.diff.range",
          },
          {
            foreground: "#79c0ff",
            token: "meta.diff.header",
          },
          {
            fontStyle: "bold",
            foreground: "#79c0ff",
            token: "meta.separator",
          },
          {
            foreground: "#79c0ff",
            token: "meta.output",
          },
          {
            foreground: "#8b949e",
            token: "brackethighlighter.tag",
          },
          {
            foreground: "#8b949e",
            token: "brackethighlighter.curly",
          },
          {
            foreground: "#8b949e",
            token: "brackethighlighter.round",
          },
          {
            foreground: "#8b949e",
            token: "brackethighlighter.square",
          },
          {
            foreground: "#8b949e",
            token: "brackethighlighter.angle",
          },
          {
            foreground: "#8b949e",
            token: "brackethighlighter.quote",
          },
          {
            foreground: "#ffa198",
            token: "brackethighlighter.unmatched",
          },
          {
            foreground: "#a5d6ff",
            token: "constant.other.reference.link",
          },
          {
            foreground: "#a5d6ff",
            token: "string.other.link",
          },
        ],
        encodedTokensColors: [],
      });

      await wireTmGrammars(monaco, registry(), grammars, editor);

      // @ts-ignore
      editor._themeService.setTheme("tm-compatible-theme");
    },
    [registry]
  );

  useEffect(() => {
    if (!editorDivRef.current) {
      return;
    }

    const uri = monaco.Uri.parse(currentFilePath);
    const language = getFileLanguageFromPath(currentFilePath);

    const existingModel = monaco.editor.getModel(uri);

    const existingFile = filesAndFoldersInitial.current.find(
      (file) => file.name === currentFilePath
    );

    const content = existingFile?.content || "";

    const model =
      existingModel || monaco.editor.createModel(content, language, uri);

    if (existingModel) {
      // initial load, other wise there wont be an existing file
      // instead the model itself will have latest contents
      if (existingFile) {
        model.setValue(content);
      }
      monaco.editor.setModelLanguage(model, language);
    }

    const editorInstance = monaco.editor.create(editorDivRef.current, {
      model,
      automaticLayout: true,
    });

    editor.current = editorInstance;

    tokenize(editorInstance, monaco);

    filesAndFoldersInitial.current = filesAndFoldersInitial.current.filter(
      (file) => file.name !== currentFilePath
    );

    return () => {
      if (editor.current) editor.current.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!containerSocket) {
      return;
    }

    containerSocket.emit(
      "fileInput",
      JSON.stringify({ request: "lswithcontent" })
    );

    containerSocket.on("fileOutputWithContent", async (jsonData: string) => {
      const parsed = JSON.parse(jsonData);
      const files: IFileFolders[] = parsed.filesAndFolders || [];

      files.forEach((file) => {
        const currentModel = editor.current?.getModel();
        const nameWithoutSlash = currentModel?.uri.path?.substring(
          1,
          currentModel?.uri.path?.length
        );

        if (file.name === nameWithoutSlash) {
          return;
        }

        const uri = monaco.Uri.parse(file.name);
        const model = monaco.editor.getModel(uri);
        const language = getFileLanguageFromPath(file.name);

        if (model) {
          const value = model.getValue();

          if (file.content && file.content !== value) {
            model.setValue(file.content);
          }
        } else {
          if (file.type === "file" && file.content) {
            monaco.editor.createModel(file.content, language, uri);
          }
        }
      });
    });
  }, [containerSocket]);

  useEffect(() => {
    if (!editor.current) return;

    const uri = monaco.Uri.parse(currentFilePath);
    const language = getFileLanguageFromPath(currentFilePath);

    let model: monaco.editor.ITextModel | null = monaco.editor.getModel(uri);

    const existingFile = filesAndFoldersInitial.current.find(
      (file) => file.name === currentFilePath
    );

    const content = existingFile?.content || "";

    if (!model) {
      model = monaco.editor.createModel(content, language, uri);
    } else if (model && existingFile) {
      model.setValue(content);
    }

    editor.current.setModel(model);

    filesAndFoldersInitial.current = filesAndFoldersInitial.current.filter(
      (file) => file.name !== currentFilePath
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFilePath]);

  useEffect(() => {
    if (!editor.current) return;

    let timeout: NodeJS.Timeout | null = null;

    const listener = editor.current.onDidChangeModelContent(() => {
      if (timeout) clearTimeout(timeout);

      timeout = setTimeout(() => {
        const value = editor.current?.getValue() || "";
        const name = editor.current?.getModel()?.uri.path || "";

        const nameWithoutSlash = name.substring(1, name.length);

        if (containerSocket) {
          containerSocket.emit(
            "fileInput",
            JSON.stringify({
              request: "update",
              name: nameWithoutSlash,
              content: value,
            })
          );
        }

        refreshOutput(false);
      }, 1000);
    });

    return () => {
      if (timeout) clearTimeout(timeout);
      listener.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, containerSocket]);

  return <div className="h-full w-full" ref={editorDivRef}></div>;
}

export default CodeEditor;
