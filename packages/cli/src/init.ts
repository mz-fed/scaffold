/*
  init.ts
  创建工程
  Created by M.Wang [cn_wang@139.com]
  2020-11-26 17:20 星期四
*/
import path from 'path';
import fs from 'fs-extra';
import logger from './logger';
import userHome from 'user-home';
import validateProjectName from 'validate-npm-package-name';
import { download, generateFiles } from './util';
export default async function init(name: string) {
  const cwd = process.cwd();
  const inCurrent = name === '.';
  const targetDir = path.resolve(cwd, name || '.');
  name = inCurrent ? path.relative('../', cwd) : name;

  const verify = validateProjectName(name);
  if (!verify.validForNewPackages) {
    logger.error('[admin-cli] 创建失败，无效的项目名称：' + name);
    const { errors = [], warnings = [] } = verify;
    errors.forEach((item) => {
      logger.error(item);
    });
    warnings.forEach((item) => {
      logger.warn(item);
    });
    process.exit(1);
  }

  if (!fs.existsSync(targetDir)) {
    logger.error(`[admin-cli] 创建失败，存在同名的文件夹.`);
    process.exit(1);
  }
  const projectTplName = path.join('m-templates', 'admin-project');
  const scaffoldTplName = path.join('m-templates', 'admin-scaffold');
  const projectTplPath = path.join(userHome, '.', projectTplName);
  const scaffoldTplPath = path.join(userHome, '.', scaffoldTplName);
  const dls = [];
  !fs.existsSync(projectTplPath) &&
    dls.push(download(projectTplName, projectTplPath));
  !fs.existsSync(scaffoldTplPath) &&
    dls.push(download(scaffoldTplName, scaffoldTplPath));
  try {
    if (dls.length > 0) {
      await Promise.all(dls);
    }
  } catch (e) {
    logger.error(`[admin-cli] 创建失败，下载模板出错.`);
    process.exit(1);
  }
  try {
    await generateFiles(projectTplName, targetDir);
  } catch (error) {
    logger.error(`[admin-cli] 创建项目文件失败`);
    process.exit(1);
  }

  try {
    await generateFiles(scaffoldTplName, `${targetDir}/src/.admin`);
  } catch (error) {
    logger.error(`[admin-cli] 创建 admin 脚手架文件失败`);
    process.exit(1);
  }
}
