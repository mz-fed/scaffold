"use strict";
/*
  routes.ts
  约定路由
  Created by M.Wang [cn_wang@139.com]
  2020-12-29 15:07 Tuesday
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const util_1 = require("../util");
const path_1 = require("path");
const fs_1 = require("fs");
const LAYOUT_NAME = '_layout';
class Router {
    constructor(options) {
        this.uid = 0;
        this.opts = options;
        assert_1.default(!fs_1.existsSync(options.root));
    }
    scanDir(dirPath, dirs) {
        const dir = path_1.parse(dirPath);
        const result = {
            name: dir.name,
            path: dirPath,
            hasLayout: false,
            files: [],
        };
        const { ignore = [], include } = this.opts;
        fs_1.readdirSync(dirPath).forEach((item) => {
            if (item.startsWith('.') || item.startsWith('_'))
                return;
            if (ignore.includes(item))
                return;
            if (include && !include.test(item))
                return;
            const absPath = path_1.join(dirPath, item);
            const { isDirectory, isFile } = fs_1.statSync(absPath);
            const fileName = item.split('.')[0];
            const hasLayout = isFile() && fileName === LAYOUT_NAME;
            if (hasLayout)
                result.hasLayout = true;
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
    dir2Route(dir) {
        const result = [];
        if (dir.files.length === 0 || (dir.hasLayout && dir.files.length == 1))
            return result;
        dir.files.forEach((item) => {
            if (item.isDir) {
            }
            else if (LAYOUT_NAME !== item.name) {
                result.push({
                    name: util_1.hyphenate(this.normalizeRouteName(item.absPath)),
                    path: dir.hasLayout
                        ? item.name
                        : `${item.dirs.join('/')}/${item.name}`,
                    component: this.normalizeComponent(item),
                });
            }
        });
        return result;
    }
    route2JSON() { }
    write() { }
    generate(dirPath, dirs) {
        const dir = this.scanDir(dirPath);
        const route = this.dir2Route(dir);
    }
    normalizeRouteName(absPath) {
        absPath = absPath.replace(this.opts.root, '');
        absPath = absPath.split('.')[0];
        const temp = absPath.split(path_1.sep);
        if (temp[0] === '')
            temp.shift();
        return temp.join(':');
    }
    normalizeComponent(file) {
        const component = this.normalizeFilePath(file.absPath);
        return `() => import(${component}')`;
    }
    normalizeFilePath(filePath) {
        return filePath.replace(`${this.opts.cwd}`, '@');
    }
    getRoutes() { }
}
function default_1(api, options) {
    api.registerCommand('routes', {
        description: '创建约定路由配置文件',
    }, (args) => { });
}
exports.default = default_1;
//# sourceMappingURL=routes.js.map