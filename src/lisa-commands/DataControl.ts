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

    getLisaProjects(){
        console.log(`lisa 工程`);
        let projectsJson:Array<[string: any]> = [];
        let createProject:any = {};
        createProject.id = 'create';
        createProject.name = '新建工程';
        createProject.description = this.getLisaDescriptByKeyword('create');
        createProject.action = this.getLisaCmdByKeyword('create');

        let options = this.getLisaOptionsByKeyword('create');
        if(options){
            createProject.options = this.getLisaOptionsByKeyword('create');
        }
        projectsJson.push(createProject);

        //常规
        let common:any = {};
        common.id = 'common';
        common.name = '常规';

        let commonOptions:Array<any> = [];
        let build:any = {};
        build.id = 'build';
        build.name = '编译';
        build.description = this.getLisaDescriptByKeyword('build');
        build.action = this.getLisaCmdByKeyword('build');
        let buildOptions = this.getLisaOptionsByKeyword('build');
        if(buildOptions){
            build.options = this.getLisaOptionsByKeyword('build');
        }
        commonOptions.push(build);

        let flash:any = {};
        flash.id = 'flash';
        flash.name = '烧录';
        flash.description = this.getLisaDescriptByKeyword('flash');
        flash.action = this.getLisaCmdByKeyword('flash');
        let flashOptions = this.getLisaOptionsByKeyword('flash');
        if(flashOptions){
            flash.options = this.getLisaOptionsByKeyword('flash');
        }
        commonOptions.push(flash);

        let clean:any = {};
        clean.id = 'clean';
        clean.name = 'clean';
        clean.description = this.getLisaDescriptByKeyword('clean');
        clean.action = this.getLisaCmdByKeyword('clean');
        let cleanOptions = this.getLisaOptionsByKeyword('clean');
        if(cleanOptions){
            clean.options = this.getLisaOptionsByKeyword('clean');
        }
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
        otherTask.description = this.getLisaDescriptByKeyword('task');
        otherTask.action = this.getLisaCmdByKeyword('task');
        let otherTaskOptions = this.getLisaOptionsByKeyword('task');
        if(otherTaskOptions){
            otherTask.options = this.getLisaOptionsByKeyword('task');
        }
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

    getLisaCmdByKeyword(keyword:string){ 
        let result ;
        this.lisaCommandsJSON.forEach((json: [string:any]) => {
            let id;
            let action;
            for(var key in json) {
                const value = json[key];
                const isObj = Object.prototype.toString.call(value) === '[object Object]';
                //遍历对象，k即为key，obj[k]为当前k对应的值
                // console.log(`>${key}:${value}(${isObj})`);
                if (key === 'id'){ 
                    id = value;
                }else if(key === 'action'){
                    action = value;
                }else if(key === 'options'){
                    value.forEach((json2: [string:any]) => {
                        for(var key2 in json2) {
                            const value2 = json2[key2];
                            // const isObj_2 = Object.prototype.toString.call(value2) === '[object Object]';
                            //遍历对象，k即为key，obj[k]为当前k对应的值
                            // console.log(`>>>${key_2}:${value_2}(${isObj_2})`);
                            if (key2 === 'id'){ 
                                id = value2;
                            }else if (key2 === 'action'){
                                action = value2;
                            }
                        }
                    });
                }
            }
            if (id === keyword){
                result = action;
            }
        });
        return result;
    }

    getLisaDescriptByKeyword(keyword:string){
        let result ;
        this.lisaCommandsJSON.forEach((json: [string:any]) => {
            let id;
            let description;
            for(var key in json) {
                const value = json[key];
                const isObj = Object.prototype.toString.call(value) === '[object Object]';
                //遍历对象，k即为key，obj[k]为当前k对应的值
                // console.log(`>${key}:${value}(${isObj})`);
                if (key === 'id'){ 
                    id = value;
                }else if(key === 'description'){
                    description = value;
                }else if(key === 'options'){
                    value.forEach((json2: [string:any]) => {
                        for(var key2 in json2) {
                            const value2 = json2[key2];
                            // const isObj_2 = Object.prototype.toString.call(value2) === '[object Object]';
                            //遍历对象，k即为key，obj[k]为当前k对应的值
                            // console.log(`>>>${key_2}:${value_2}(${isObj_2})`);
                            if (key2 === 'id'){ 
                                id = value2;
                            }else if (key2 === 'description'){
                                description = value2;
                            }
                        }
                    });
                }
            }
            if (id === keyword){
                result = description;
            }
        });
        return result;
    }

    getLisaOptionsByKeyword(keyword:string){ 
        let result ;
        this.lisaCommandsJSON.forEach((json: [string:any]) => {
            let id;
            let options;
            for(var key in json) {
                const value = json[key];
                const isObj = Object.prototype.toString.call(value) === '[object Object]';
                //遍历对象，k即为key，obj[k]为当前k对应的值
                // console.log(`>${key}:${value}(${isObj})`);
                if (key === 'id'){ 
                    id = value;
                }else if(key === 'options'){
                    options = value;
                }
            }
            if (id === keyword){
                result = options;
            }
        });
        return result;
    }
}
export default DataControl;