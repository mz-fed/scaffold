export interface OptionConfig {
  default?: any;
  type?: any[];
}
export type OptionsItem = {
  description: string;
  option?: OptionConfig;
};

export type CommandOption = {
  [key: string]: OptionsItem;
};
export type CommandOptions = {
  description: string;
  options?: CommandOption;
  alias?: string;
};

export type Noop = (...args: any[]) => any;

export type Plugin = {
  id: string;
  apply: Function;
};

export type Command = {
  [index: string]: Boolean;
};

export type RouteOpts = {
  watch: boolean;
  root: string;
  ignore: string[];
  output: string;
  cwd: string;
  watchIgnore: RegExp;
  include: RegExp;
  ts: boolean;
};

export type FileTree = {
  id: number;
  file: string;
  filename: string;
  path: string;
  filePath: string; //文件相对路径，带扩名
  children?: string[];
};

export type Route = {
  name: string;
  path: string;
  component: string;
  children?: Route[];
  meta?: { [key: string]: any };
};

export type File = {
  id: number;
  name: string; // 文件名不包括后缀
  absPath: string; // 绝对路径
  isDir: boolean;
  dirs: string[]; // 目录层级
};

export type Dir = {
  name: string;
  path: string;
  hasLayout?: Boolean;
  files: File[];
};
