"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGitUserInfo = exports.installDependencies = exports.generateFiles = exports.checkUpdate = exports.download = exports.runCmd = exports.hyphenate = void 0;
/*
  util.ts
  工具函数
  Created by M.Wang [cn_wang@139.com]
  2020-11-26 18:14 星期四
*/
const execa = require('execa');
const debug = require('debug')('mz-vite:util');
const download_git_repo_1 = __importDefault(require("download-git-repo"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const fast_glob_1 = __importDefault(require("fast-glob"));
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const logger_1 = __importDefault(require("./logger"));
// 驼峰 转 中横线
const hyphenateRE = /\B([A-Z])/g;
function hyphenate(str) {
    return str.replace(hyphenateRE, '-$1').toLowerCase();
}
exports.hyphenate = hyphenate;
async function runCmd(cmd, argv, opts) {
    argv = Array.isArray(argv) ? argv : [];
    opts = opts || {};
    return await execa(cmd, argv, opts);
}
exports.runCmd = runCmd;
let isYarn = false;
(async () => {
    try {
        await runCmd('yarn', ['-v']);
        isYarn = true;
    }
    catch (error) {
        isYarn = false;
    }
})();
/**
 * 从 github 仓库下载
 * @date 2020-11-27
 * @param {any} template:string
 * @param {any} tmpsPath:string
 * @returns {any}
 */
function download(templateRepo, tmpsPath) {
    return new Promise((resolve, reject) => {
        try {
            download_git_repo_1.default(templateRepo, tmpsPath, null, (err) => {
                if (err) {
                    reject(err);
                }
                resolve(true);
            });
        }
        catch (error) {
            reject(error);
        }
    });
}
exports.download = download;
// 检查更新
function checkUpdate(pkgPath) {
    logger_1.default.info('TODO');
}
exports.checkUpdate = checkUpdate;
// 创建项目文件
async function generateFiles(tplPath, target, params = {}) {
    debug(`generateFiles params:
      tplPath:${tplPath}
      target:${target}
      params:${JSON.stringify(params)}
    `);
    if (process.cwd() !== target) {
        await fs_extra_1.default.ensureDir(target);
    }
    const files = await fast_glob_1.default(['**/*'], { cwd: tplPath, dot: true });
    debug('files:' + JSON.stringify(files));
    const promises = [];
    files.forEach((f) => {
        const emitAsset = async () => {
            let content = await fs_extra_1.default.readFile(path_1.default.join(tplPath, f), 'utf8');
            content = ejs_1.default.render(content || '', params);
            const targetFile = path_1.default.join(target, f);
            const targetDir = path_1.default.dirname(targetFile);
            await fs_extra_1.default.ensureDir(targetDir);
            await fs_extra_1.default.writeFile(targetFile, content, { flag: 'a' });
        };
        promises.push(emitAsset());
    });
    await Promise.all(promises);
}
exports.generateFiles = generateFiles;
// 安装依赖
async function installDependencies(cwd) {
    const cmd = isYarn ? 'yarn' : 'npm';
    const args = isYarn ? [] : ['install'];
    return runCmd(cmd, args, {
        cwd,
        stdio: 'inherit',
        shell: true,
    });
}
exports.installDependencies = installDependencies;
// 获取 git 用户信息
async function getGitUserInfo() {
    let name = '';
    try {
        const { stdout } = await runCmd('git', ['config', '--get', 'user.name']);
        stdout && (name = stdout);
    }
    catch (error) {
        // error
    }
    let email = '';
    try {
        const { stdout } = await runCmd('git', ['config', '--get', 'user.email']);
        stdout && (email = stdout);
    }
    catch (error) {
        // error
    }
    return { name, email };
}
exports.getGitUserInfo = getGitUserInfo;
//# sourceMappingURL=util.js.map