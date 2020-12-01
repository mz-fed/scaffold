/*
  init.ts
  创建工程
  Created by M.Wang [cn_wang@139.com]
  2020-11-26 17:20 星期四
*/
import path from 'path';
import fs from 'fs-extra';
import logger from './logger';
import inquirer from 'inquirer';
import userHome from 'user-home';
import validateProjectName from 'validate-npm-package-name';
import { download, generateFiles, getGitUserInfo } from './util';
const pkg = require('../package.json');
const debug = require('debug')('mz-vite:init');

export default async function init(name: string) {
  const cwd = process.cwd();
  const inCurrent = name === '.';
  const targetDir = path.resolve(cwd, name || '.');
  name = inCurrent ? path.relative('../', cwd) : name;
  validate({ name, targetDir });
  debug('validate ok');

  const projectType = await getProjectType();
  debug(
    `init Project info:
    cwd:${cwd}
    inCurrent:${inCurrent}
    targetDir:${targetDir}
    name:${name}
    projectType:${projectType}
  `,
  );

  const projectTplName = path.join('mz-fed', 'vite-project-tmpl');
  const projectTplPath = path.join(userHome, '.' + projectTplName);
  debug(`
  tmpl info
    projectTplPath:${projectTplPath}
  `);
  const dls = [];
  !fs.existsSync(projectTplPath) &&
    dls.push(download(projectTplName, projectTplPath));
  try {
    if (dls.length > 0) {
      await Promise.all(dls);
    }
  } catch (e) {
    logger.error(`[admin-cli] 创建项目失败:下载模板出错.`);
    process.exit(1);
  }
  const userInfo = await getGitUserInfo();
  const generateParams = {
    projectType,
    projectName: name,
    userName: userInfo.name,
    userEmail: userInfo.email,
  };
  try {
    await generateFiles(
      path.join(projectTplPath, `template`),
      targetDir,
      generateParams,
    );
    await generateFiles(
      path.join(projectTplPath, `mz-${projectType}`),
      path.join(targetDir, 'src/.mz'),
      generateParams,
    );
    await fs.writeFile(
      path.join(targetDir, '.mz'),
      `CREATOR=${
        userInfo.name
      }\nCRATED_AT=${new Date().toString()}\nMZ_VITE_V=${pkg.version}`,
      { flag: 'a' },
    );
  } catch (error) {
    logger.error(`[admin-cli] 创建项目文件失败`);
    process.exit(1);
  }
}

// 获取项目类型
async function getProjectType(): Promise<string> {
  const { type } = await inquirer.prompt({
    type: 'list',
    name: 'type',
    message: '选择工程模板',
    choices: [
      { name: 'admin         ->  vite + vue3 管理平台工程', value: 'admin' },
      { name: 'web           ->  vite + vue3 工程', value: 'web' },
    ],
  });

  return type;
}

type ValidateParams = {
  name: string;
  targetDir: string;
};

// 验证参数
async function validate(data: ValidateParams) {
  const { name, targetDir } = data;
  const verify = validateProjectName(name);
  if (!verify.validForNewPackages) {
    logger.error('[admin-cli] 创建项目失败：无效的项目名称：' + name);
    const { errors = [], warnings = [] } = verify as any;
    errors.forEach((item: any) => {
      logger.error(item);
    });
    warnings.forEach((item: any) => {
      logger.warn(item);
    });
    process.exit(1);
  }

  if (fs.existsSync(targetDir)) {
    logger.error(`[admin-cli] 创建项目失败：存在同名的文件夹.`);
    process.exit(1);
  }
}
