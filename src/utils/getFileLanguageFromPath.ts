const getFileLanguageFromPath = (filePath: string): string => {
  let language = "typescript";

  const splitted = filePath.split(".");
  const extension = splitted[splitted.length - 1];

  switch (extension) {
    case "js":
      language = "javascript";
      break;
    case "ts":
      language = "typescript";
      break;
    case "html":
      language = "html";
      break;
    case "css":
      language = "css";
      break;
    default:
      language = "typescript";
      break;
  }

  return language;
};

export { getFileLanguageFromPath };
