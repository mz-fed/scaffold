"use strict";
/*
  init.ts
  Created by M.Wang [cn_wang@139.com]
  2020-12-28 16:17 Monday
*/
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(api, options) {
    api.registerCommand('init <project-name>', {
        description: '创建一个 mz-vite 项目',
    }, async (args) => {
        console.log(args);
    });
}
exports.default = default_1;
//# sourceMappingURL=init.js.map