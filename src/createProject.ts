

import * as vscode from 'vscode';
import { checkLogin } from './utils/index';

export function createProject() {
    vscode.commands.registerCommand('lisa.createProject', () => {
        const hasLogin = checkLogin();
        if (!hasLogin) {
            return vscode.commands.executeCommand('lisa.showLogin');
        }
        vscode.window.showInformationMessage('新建工程目录选择', '浏览').then(value => {
            if (value === '浏览') {
                vscode.window.showOpenDialog({
                    canSelectFiles: false, // 是否可选文件
                    canSelectFolders: true, // 是否可选文件夹
                    canSelectMany: false, // 是否可以选择多个
                    openLabel: '确定'
                }).then(function (msg) {
                    console.log(msg);
                    if (msg && msg[0]) {
                        vscode.commands.executeCommand('lisa.command', `cd ${msg[0].fsPath} | lisa create`);
                    }
                });
            }
        });
    });
}

