"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const execa = require('execa');
const vite = require.resolve('vite/bin/vite');
function default_1(api, options) {
    api.registerCommand('[serve]', {
        description: '启动开发服务',
        alias: 'serve',
    }, async (args) => {
        await execa(vite, [], {
            stdio: 'inherit',
        });
    });
}
exports.default = default_1;
//# sourceMappingURL=serve.js.map