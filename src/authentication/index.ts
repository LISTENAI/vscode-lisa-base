/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { OauthProvider } from './oauthProvider';

export async function authentication() {
    const loginService = new OauthProvider();
    await loginService.initialize();
    console.log('你有session吗');
    console.log(loginService.sessions);
    if (!loginService.sessions.accessToken) {
        vscode.commands.executeCommand('lisa.showLogin');
    }
    vscode.commands.registerCommand("lisa.showLogin", async function () {
        vscode.window.showInformationMessage('登录态已过期，请重新登录', '去登录').then(value => {
            if (value === '去登录') {
              vscode.commands.executeCommand('lisa.login');
            }
          });
    });
    vscode.commands.registerCommand("lisa.login", async function () {
        console.log('进来登录');
        await loginService.login();
       
    });
}

