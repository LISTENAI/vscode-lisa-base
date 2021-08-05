// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
// import DataControl from './lisa-commands/DataControl';
import NodeDependenciesProvider from './lisa-commands/NodeDependenciesProvicer';
import {DataItem,TreeDataModel ,TreeDataActionModel} from './lisa-commands/DataItem';
import {cmd} from './cmd';
import LisaStatusBar from './statusBar';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  var mdTml: vscode.Terminal | undefined;
  var sisaStatusBar:LisaStatusBar = new LisaStatusBar();
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	let treeProvicer:NodeDependenciesProvider = new NodeDependenciesProvider();
	vscode.window.registerTreeDataProvider("lisa.tree",treeProvicer);
	treeProvicer.reloadData();

	var isRefresh:Boolean = false;

	let lisaStatusBar = vscode.commands.registerCommand('lisa.StatusBar', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
	});

	let lisaStatusBarCreate = vscode.commands.registerCommand('lisa.StatusBarCreate', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		console.log('创建');
		vscode.commands.executeCommand('lisa.command', '');
	});

	let lisaStatusBarBuild = vscode.commands.registerCommand('lisa.StatusBarBuild', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		console.log('构建');
		vscode.commands.executeCommand('lisa.command', '');
	});

	let lisaStatusBarFlash = vscode.commands.registerCommand('lisa.StatusBarFlash', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		console.log('烧录');
		vscode.commands.executeCommand('lisa.command', '');
	});

	let lisaStatusBarClean = vscode.commands.registerCommand('lisa.StatusBarClean', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		console.log('清理');
		vscode.commands.executeCommand('lisa.command', '');
	});

	let refreshCommands = vscode.commands.registerCommand('lisa.refreshEntry', () => {
		if (isRefresh){
			return; 
		}
		console.log('进入刷新');
		let loadding = vscode.window.withProgress({
			location: vscode.ProgressLocation.Window,
			title: "正在加载lisa 功能菜单...",
			cancellable: true
		  }, (progress) => {
			const p = new Promise<void>(async resolve => {
				isRefresh = true;
			    await treeProvicer.refresh();
				isRefresh = false;
				resolve();
			});
			return p;
		});
	});

	let loadDataCommands = vscode.commands.registerCommand('lisa.reloadData', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		treeProvicer.reloadData();
	});

	let treeNodeClick = vscode.commands.registerCommand('lisa.tree.onClick', (id,name,action,options)=>{
		const actionModel:TreeDataActionModel = action;
		// const optionsModel:TreeDataModel = options;
		console.log(`node的节点ID：${id} [${actionModel.cmd}] [${options}] `);
		// if (optionsModel !== undefined || optionsModel !== null){
		// 	return;
		// }
		if (actionModel.cmd != undefined && actionModel.cmd != null && actionModel.cmd != '') {
			vscode.commands.executeCommand('lisa.command', actionModel.cmd);
		}
	});

	let showConsole = vscode.commands.registerCommand('lisa.command', async (command, background?: boolean)=>{
		console.log(`执行命令：${command}, background: ${background}`);
		if (background) {
			const res = await cmd(command);
			return res;
		} else {
			mdTml = vscode.window.activeTerminal || vscode.window.terminals[0] || vscode.window.createTerminal('lisa');
			mdTml.show(true);
			mdTml.sendText(command);
		}
	});

	vscode.window.onDidCloseTerminal((terminal) => { // 监听终端被关闭
    mdTml = undefined;
	});
	// context.subscriptions.push(refreshCommands);
	// context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
