export interface IFileFolders {
  name: string;
  type: "directory" | "file";
  content?: string;
  inside?: IFileFolders[]; // single level support for now
}
