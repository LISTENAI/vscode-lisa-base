

import * as vscode from 'vscode';
// import {checkLogin} from '../utils/index';
export function createLisaStatusBar({ subscriptions }: vscode.ExtensionContext) {
    //新建工程
    const createCommandId = 'lisa.createProject';
    //编译
    const buildCommandId = 'lisa.showbuildStatusBar';
    subscriptions.push(vscode.commands.registerCommand(buildCommandId, () => {
        // const hasLogin = checkLogin();
        // if(!hasLogin){
        //     return vscode.commands.executeCommand('lisa.showLogin');
        // }
        vscode.commands.executeCommand('lisa.command', `lisa build`);
    }));
    //烧录
    const flashCommandId = 'lisa.showflashStatusBar';
    subscriptions.push(vscode.commands.registerCommand(flashCommandId, () => {
        // const hasLogin = checkLogin();
        // if(!hasLogin){
        //     return vscode.commands.executeCommand('lisa.showLogin');
        // }
        vscode.commands.executeCommand('lisa.command', `lisa flash`);
    }));
    const createProjectBarItem = createBarItem(`$(add)`, '创建工程', 300, createCommandId);
    const buildBarItem = createBarItem(`$(check)`, '编译', 200, buildCommandId);
    const flashBarItem = createBarItem(`$(arrow-down)`, '烧录', 100, flashCommandId);

    subscriptions.push(buildBarItem);
    subscriptions.push(createProjectBarItem);
    subscriptions.push(flashBarItem);


    // register some listener that make sure the status bar 
    // item always up-to-date
    // subscriptions.push(vscode.window.onDidChangeActiveTextEditor(updateStatusBarItem));
    // subscriptions.push(vscode.window.onDidChangeTextEditorSelection(updateStatusBarItem));
    // update status bar item once at start
    // updateStatusBarItem();
}

function createBarItem(text: string, tooltip: string, position: number, command: string): vscode.StatusBarItem {
    const myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, position);
    myStatusBarItem.command = command;
    myStatusBarItem.text = text;
    myStatusBarItem.tooltip = tooltip;
    myStatusBarItem.show();
    return myStatusBarItem;
}