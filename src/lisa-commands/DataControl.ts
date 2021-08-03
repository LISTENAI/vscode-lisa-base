import * as vscode from 'vscode';
import * as Configstore from 'configstore';
import { SSL_OP_LEGACY_SERVER_CONNECT } from 'node:constants';
import { create } from 'node:domain';
const config = new Configstore('lisa');
// import * as fs from 'fs';
// import * as path from 'path';
// import {DataItem, TreeDataModel} from './DataItem';
const process = require('child_process');

class DataControl {
    static instance: DataControl;
    static getInstance() {
        if (!DataControl.instance) {
            DataControl.instance = new DataControl();
        }
        return DataControl.instance;
    }
    lisaProjectJSON:Array<[string: any]> = config.get('projects') || [];
    lisaCommandsJSON:Array<[string: any]> = config.get('commands') || [];

    async getLisaProjects(){
        console.log(`lisa 工程`);
        let projectsJson:Array<[string: any]> = [];

        let createProject:any = {};
        createProject.id = 'create';
        createProject.name = '新建工程';
        createProject.description = '创建项目，例`lisa create newProject -t @generator/csk`';
        createProject.action = {type:'run_cmd','cmd':'lisa build'};
        projectsJson.push(createProject);

        //常规
        let common:any = {};
        common.id = 'common';
        common.name = '常规';

        let commonOptions:Array<any> = [];
        let build:any = {};
        build.id = 'build';
        build.name = '编译';
        build.description = '固件开发项目编译打包';
        build.action = {type:'run_cmd','cmd':'lisa build'};
        commonOptions.push(build);

        let flash:any = {};
        flash.id = 'flash';
        flash.name = '烧录';
        flash.description = '烧录程序';
        flash.action = {type:'run_cmd','cmd':'lisa flash'};
        commonOptions.push(flash);

        let clean:any = {};
        clean.id = 'clean';
        clean.name = 'clean';
        clean.description = 'clean';
        clean.action = {type:'run_cmd','cmd':'lisa clean'};
        commonOptions.push(clean);
        common.options = commonOptions;
        projectsJson.push(common);

        // 扩展
        let extension:any = {};
        extension.id = 'extension';
        extension.name = '扩展';

        let extensionOptions:Array<any> = [];
        let otherTask:any = {};
        otherTask.id = 'otherTask';
        otherTask.name = '其他任务';
        otherTask.description = '固件开发项目编译打包';
        otherTask.action = {type:'run_cmd','cmd':'lisa task'};
        extensionOptions.push(otherTask);
        extension.options = extensionOptions;
        projectsJson.push(extension);

        DataControl.getInstance().lisaProjectJSON = projectsJson;
        config.set('projects', projectsJson);
        console.log("获取lisa 工程完成"+JSON.stringify(projectsJson));
    }

    async getLisaCommands():Promise<void>{
        const cmd = 'lisa commands --json';
        console.log(`lisa命令执行`);
        return new Promise(function(resolve, reject){
            vscode.commands.executeCommand('lisa.command', cmd, true).then((result: any) => {
                let json = JSON.parse(result.stdout);
                DataControl.getInstance().lisaCommandsJSON = json;
                config.set('commands', json);
                console.log("获取lisa commands完成");
                resolve();
                vscode.commands.executeCommand('lisa.reloadData');
			});
        });
    }
}
export default DataControl;