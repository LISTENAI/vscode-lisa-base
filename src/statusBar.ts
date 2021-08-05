// 这里的知识都可以从 api 中查到哦
// 下文有 api 截图，请大家参考，不过还是希望小伙伴们能够自行查一下哈～
import { window, StatusBarItem, StatusBarAlignment } from 'vscode';

export default class LisaStatusBar {
    // 创建
    private createStatusBar : StatusBarItem | undefined;
    // 编译
    private buildStatusBar : StatusBarItem | undefined;
    // 烧录
    private flashStatusBar : StatusBarItem | undefined;
    // clean
    private cleanStatusBar : StatusBarItem | undefined;
  constructor(){
    // 如果该属性不存在就创建一个
    if (!this.createStatusBar) {
        this.createStatusBar  = window.createStatusBarItem(StatusBarAlignment.Left);
    }
    this.createStatusBar.command = 'lisa.StatusBarCreate';
    this.createStatusBar.tooltip = '创建';
    this.createStatusBar.text = '创建';
    this.createStatusBar.show();

    if (!this.buildStatusBar) {
        this.buildStatusBar  = window.createStatusBarItem(StatusBarAlignment.Left);
    }
    this.buildStatusBar.text = '编译';
    this.buildStatusBar.tooltip = '编译';
    this.buildStatusBar.command = 'lisa.StatusBarBuild';
    this.buildStatusBar.show();

    if (!this.flashStatusBar) {
        this.flashStatusBar  = window.createStatusBarItem(StatusBarAlignment.Left);
    }
    this.flashStatusBar.text = '烧录';
    this.flashStatusBar.tooltip = '烧录';
    this.flashStatusBar.command = 'lisa.StatusBarFlash';
    this.flashStatusBar.show();

    if (!this.cleanStatusBar) {
        this.cleanStatusBar  = window.createStatusBarItem(StatusBarAlignment.Left);
    }
    this.cleanStatusBar.text = 'clean';
    this.cleanStatusBar.tooltip = 'clean';
    this.cleanStatusBar.command = 'lisa.StatusBarClean';
    this.cleanStatusBar.show();
  }

  dispose() {
    if (this.buildStatusBar) {
        this.buildStatusBar.dispose();
    }
  }
} 
