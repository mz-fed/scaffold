/*
  util.ts
  工具函数
  Created by M.Wang [cn_wang@139.com]
  2020-11-26 18:14 星期四
*/
const execa = require('execa');
const debug = require('debug')('mz-vite:util');
import dl from 'download-git-repo';
import fs from 'fs-extra';
import fg from 'fast-glob';
import path from 'path';
import ejs from 'ejs';
import logger from './logger';

interface UserInfo {
  name: string;
  email: string;
}

export async function runCmd(cmd: string, argv?: any[], opts?: any) {
  argv = Array.isArray(argv) ? argv : [];
  opts = opts || {};
  return await execa(cmd, argv, opts);
}

let isYarn = false;
(async () => {
  try {
    await runCmd('yarn', ['-v']);
    isYarn = true;
  } catch (error) {
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
export function download(
  templateRepo: string,
  tmpsPath: string,
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    try {
      dl(templateRepo, tmpsPath, null, (err: any) => {
        if (err) {
          reject(err);
        }
        resolve(true);
      });
    } catch (error) {
      reject(error);
    }
  });
}

// 检查更新
export function checkUpdate(pkgPath: string) {
  logger.info('TODO');
}

// 创建项目文件
export async function generateFiles(
  tplPath: string,
  target: string,
  params: any = {},
) {
  debug(
    `generateFiles params:
      tplPath:${tplPath}
      target:${target}
      params:${JSON.stringify(params)}
    `,
  );
  if (process.cwd() !== target) {
    await fs.ensureDir(target);
  }

  const files = await fg(['**/*'], { cwd: tplPath, dot: true });
  debug('files:' + JSON.stringify(files));
  const promises: Promise<any>[] = [];

  files.forEach((f) => {
    const emitAsset = async () => {
      let content = await fs.readFile(path.join(tplPath, f), 'utf8');
      content = ejs.render(content || '', params);
      const targetFile = path.join(target, f);
      const targetDir = path.dirname(targetFile);
      await fs.ensureDir(targetDir);
      await fs.writeFile(targetFile, content, { flag: 'a' });
    };
    promises.push(emitAsset());
  });

  await Promise.all(promises);
}

// 安装依赖
export async function installDependencies(cwd: string) {
  const cmd = isYarn ? 'yarn' : 'npm';
  const args = isYarn ? [] : ['install'];
  return runCmd(cmd, args, {
    cwd,
    stdio: 'inherit',
    shell: true,
  });
}

// 获取 git 用户信息
export async function getGitUserInfo(): Promise<UserInfo> {
  let name = '';
  try {
    const { stdout } = await runCmd('git', ['config', '--get', 'user.name']);
    stdout && (name = stdout);
  } catch (error) {
    // error
  }
  let email = '';
  try {
    const { stdout } = await runCmd('git', ['config', '--get', 'user.email']);
    stdout && (email = stdout);
  } catch (error) {
    // error
  }

  return { name, email };
}
