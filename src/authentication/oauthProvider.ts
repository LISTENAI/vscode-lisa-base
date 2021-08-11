
import * as vscode from 'vscode';

import * as Configstore from 'configstore';
const config = new Configstore('lisa');
interface SessionData {
	id: number;
	accountName: string;
	username: string;
	accessToken: string;
	expire: number;
}

export class OauthProvider {
	private _sessions: SessionData ;
	private _statusBarItem: vscode.StatusBarItem | undefined;

	private timeid: NodeJS.Timeout | undefined;
	_oauthServer: any;
	constructor() {
		this._sessions = {} as SessionData;
		this.timeid && clearInterval(this.timeid);
		this.timeid = undefined;
	}

	get sessions() {
		return this._sessions || {} as SessionData;
	}
	private updateStatusBarItem(text: string) {
		if (!this._statusBarItem) {
			this._statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
			this._statusBarItem.text = text;
			if(text === '请登录'){
				this._statusBarItem.command = 'lisa.login';
			}
			this._statusBarItem.show();
		}else{
			this._statusBarItem.text = text;
			if(text === '请登录'){
				this._statusBarItem.command = 'lisa.login';
			}
		}
		if (!this._statusBarItem) {
			// this._statusBarItem.dispose();
			this._statusBarItem = undefined;
		}
	}
	async initialize() {
		try {
			const sessions: SessionData = this.readSessions();
			console.log('ininin->', sessions);
			if (sessions && (sessions.expire || 0) > new Date().getTime()) {
				this._sessions = sessions;
				this.hasLogin();
			} else{
				this.updateStatusBarItem("请登录");
			}

		}
		catch (e) {
			// Ignore, network request failed
		}
	}

	async login() {
		//lisa扫码登录之后 监听控制台输出（window.onDidWriteTerminalData 非正式发布api,无法用在发布的插件中） 登录成功会打印登录成功
		//轮询获取登录状态
		vscode.commands.executeCommand('lisa.command', 'lisa login');
		try {
			this.timeid && clearInterval(this.timeid);
			this.timeid = undefined;
			const res = await this.getUserInfo();
			if(res){
				vscode.window.showInformationMessage("登录成功");
				this.hasLogin();
			}else{
				vscode.window.showInformationMessage("登录失败");
				this.updateStatusBarItem("请登录");
			}
		} catch (error) {
			vscode.window.showInformationMessage("登录失败");
			this.updateStatusBarItem("请登录");
		}



	}
	private async getUserInfo() {
		const self = this;
		let i = 0;
	  	const res = await	new Promise((resolve,reject)=>{
			self.timeid = setInterval(function () {
				i = i + 1;
				console.log(i);
				if (i > 60*5) {
					console.log('查了5分钟还没结果，超时啦');
					self.timeid && clearInterval(self.timeid);
					self.timeid = undefined;
					reject(false);
				}
				const sessions: SessionData = self.readSessions();
				if (sessions && (sessions.expire || 0) > new Date().getTime()) {
					self._sessions = sessions;
					self.timeid && clearInterval(self.timeid);
					self.timeid = undefined;
					resolve(true);
				}
			},1000);
		});
		
		return res;
	}

    readSessions() {
		return config.get('userInfo');
	}

	private async hasLogin() {
		if (this._sessions.accountName) {
		console.log('已经登陆',this._sessions.accountName);

			this.updateStatusBarItem(this._sessions.accountName);
		}
	}

}
