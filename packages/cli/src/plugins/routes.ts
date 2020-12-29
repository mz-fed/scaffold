/*
  routes.ts
  约定路由
  Created by M.Wang [cn_wang@139.com]
  2020-12-29 15:07 Tuesday
*/

import assert from 'assert';
import PluginApi from '../PluginApi';
import { hyphenate } from '../util';
import { RouteOpts, File, Dir, Route } from '../type';
import { resolve, join, sep, parse, ParsedPath } from 'path';
import { existsSync, readdirSync, statSync } from 'fs';
import { outputFileSync } from 'fs-extra';
const LAYOUT_NAME = '_layout';

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
      files: [],
    };

    const { ignore = [], include } = this.opts;
    readdirSync(dirPath).forEach((item) => {
      if (item.startsWith('.') || item.startsWith('_')) return;
      if (ignore.includes(item)) return;
      if (include && !include.test(item)) return;

      const absPath = join(dirPath, item);
      const { isDirectory, isFile } = statSync(absPath);
      const fileName = item.split('.')[0];
      const hasLayout = isFile() && fileName === LAYOUT_NAME;
      if (hasLayout) result.hasLayout = true;
      result.files.push({
        id: this.uid++,
        name: fileName,
        absPath,
        isDir: isDirectory(),
        dirs: [],
      });
    });

    return result;
  }

  private dir2Route(dir: Dir): Route[] {
    const result: Route[] = [];
    if (dir.files.length === 0 || (dir.hasLayout && dir.files.length == 1))
      return result;

    dir.files.forEach((item) => {
      if (item.isDir) {
      } else if (LAYOUT_NAME !== item.name) {
        result.push({
          name: hyphenate(this.normalizeRouteName(item.absPath)),
          path: dir.hasLayout
            ? item.name
            : `${item.dirs.join('/')}/${item.name}`,
          component: this.normalizeComponent(item),
        });
      }
    });

    return result;
  }

  private route2JSON() {}

  private write() {}

  private generate(dirPath: string, dirs: string[]) {
    const dir = this.scanDir(dirPath);
    const route = this.dir2Route(dir);
  }

  private normalizeRouteName(absPath: string): string {
    absPath = absPath.replace(this.opts.root, '');
    absPath = absPath.split('.')[0];
    const temp = absPath.split(sep);
    if (temp[0] === '') temp.shift();

    return temp.join(':');
  }

  private normalizeComponent(file: File): string {
    const component = this.normalizeFilePath(file.absPath);
    return `() => import(${component}')`;
  }

  private normalizeFilePath(filePath: string) {
    return filePath.replace(`${this.opts.cwd}`, '@');
  }
  getRoutes() {}
}
export default function (api: PluginApi, options: any) {
  api.registerCommand(
    'routes',
    {
      description: '创建约定路由配置文件',
    },
    (args: any) => {},
  );
}
