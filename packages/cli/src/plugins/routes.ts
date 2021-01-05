/*
  routes.ts
  约定路由
  Created by M.Wang [cn_wang@139.com]
  2020-12-29 15:07 Tuesday
*/

import assert from "assert";
import PluginApi from "../PluginApi";
import { hyphenate } from "../util";
import { RouteOpts, File, Dir, Route } from "../type";
import { resolve, join, sep, parse, ParsedPath } from "path";
import { existsSync, readdirSync, statSync } from "fs";
import { outputFileSync } from "fs-extra";
const LAYOUT_NAME = "_layout";

class Router {
  private opts: RouteOpts;
  private uid = 0;
  constructor(options: RouteOpts) {
    this.opts = options;
    assert(!existsSync(options.root));
  }
  private scanDir(dirPath: string, dirs: string[]): Dir {
    const dir = parse(dirPath);
    const result: Dir = {
      name: dir.name,
      path: dirPath,
      hasLayout: false,
      files: []
    };

    const { ignore = [], include } = this.opts;
    readdirSync(dirPath).forEach((item: string) => {
      if (item.startsWith(".") || item.startsWith("_")) return;
      if (ignore.includes(item)) return;
      if (include && !include.test(item)) return;

      const absPath = join(dirPath, item);
      const { isDirectory, isFile } = statSync(absPath);
      const fileName = item.split(".")[0];
      const hasLayout = isFile() && fileName === LAYOUT_NAME;
      if (hasLayout) result.hasLayout = true;
      result.files.push({
        id: this.uid++,
        name: fileName,
        absPath,
        isDir: isDirectory(),
        dirs: hasLayout ? [] : [...dirs]
      });
    });

    return result;
  }

  private dir2Route(dir: Dir): Route[] {
    const result: Route[] = [];
    if (dir.files.length === 0 || (dir.hasLayout && dir.files.length == 1))
      return result;

    dir.files.forEach(item => {
      if (item.isDir) {
      } else if (LAYOUT_NAME !== item.name) {
        result.push({
          name: hyphenate(this.normalizeRouteName(item.absPath)),
          path: dir.hasLayout
            ? item.name
            : `${item.dirs.join("/")}/${item.name}`,
          component: this.normalizeComponent(item)
        });
      }
    });

    return result;
  }

  private route2JSON(route: Route[]): string {
    return JSON.stringify(route, null, 2)
      .replace(/\"component\": (\"(.+?)\")/g, (global, m1, m2) => {
        return `"component": ${m2.replace(/\'/g, '"')}`;
      })
      .replace(/\\r\\n/g, "\r\n")
      .replace(/\\n/g, "\r\n");
  }

  private write(text: string) {
    const date = new Date();
    outputFileSync(
      this.opts.output,
      `/**
 * created: mz-vite
 * date：${date.getFullYear()}-${date.getMonth() +
        1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}
 */

export default ${text}
`
    );
  }

  private generate(dirPath: string, dirs: string[]): Route[] | undefined {
    const dir = this.scanDir(dirPath, dirs);
    const route = this.dir2Route(dir);
    if (dirPath === this.opts.root) {
      const routeStr = this.route2JSON(route);
      this.write(routeStr);
      return;
    }

    return route;
  }

  private normalizeRouteName(absPath: string): string {
    absPath = absPath.replace(this.opts.root, "");
    absPath = absPath.split(".")[0];
    const temp = absPath.split(sep);
    if (temp[0] === "") temp.shift();

    return temp.join(":");
  }

  private normalizeComponent(file: File): string {
    const component = this.normalizeFilePath(file.absPath);
    return `() => import(${component}')`;
  }

  private normalizeFilePath(filePath: string) {
    return filePath.replace(`${this.opts.cwd}`, "@");
  }
  run() {
    this.generate(this.opts.root, []);
  }
}
export default function(api: PluginApi, options: any) {
  api.registerCommand(
    "routes",
    {
      description: "创建约定路由配置文件",
      options: {
        "--watch": {
          description: "[boolean] 监听文件变化,修改后会重新构建路由表."
        }
      }
    },
    (args: any) => {}
  );
}
