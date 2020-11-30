/*
  update.ts
  更新 admin 脚手架
  Created by M.Wang [cn_wang@139.com]
  2020-11-30 15:40 星期一
*/
import path from 'path';
import userHome from 'user-home';
import { checkUpdate } from './util';

export default async function update() {
  const scaffoldPkgPath = path.join(
    userHome,
    '.',
    'm-templates',
    'admin-scaffold',
    'package.json',
  );
  checkUpdate(scaffoldPkgPath);
}
