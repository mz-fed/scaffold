interface UserInfo {
    name: string;
    email: string;
}
export declare function runCmd(cmd: string, argv?: any[], opts?: any): Promise<any>;
/**
 * 从 github 仓库下载
 * @date 2020-11-27
 * @param {any} template:string
 * @param {any} tmpsPath:string
 * @returns {any}
 */
export declare function download(templateRepo: string, tmpsPath: string): Promise<boolean>;
export declare function checkUpdate(pkgPath: string): void;
export declare function generateFiles(tplPath: string, target: string, params?: any): Promise<void>;
export declare function installDependencies(cwd: string): Promise<any>;
export declare function getGitUserInfo(): Promise<UserInfo>;
export {};
