import * as vscode from 'vscode';
import DataControl from './DataControl';
import {DataItem, TreeDataActionModel, TreeDataModel} from './DataItem';
export default class NodeDependenciesProvider implements vscode.TreeDataProvider<DataItem>
{
    // onDidChangeTreeData?: vscode.Event<any> | undefined;

    private _onDidChangeTreeData: vscode.EventEmitter<DataItem | undefined | null | void> = new vscode.EventEmitter<DataItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<DataItem | undefined | null | void> = this._onDidChangeTreeData.event;

    refresh() {
        DataControl.getInstance().getLisaCommands();
        return DataControl.getInstance().getLisaProjects();
    }

    reloadData(): void{
        this.loadData();
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: any): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }
    getChildren(element?: any): vscode.ProviderResult<any[]> {
        if (element === undefined) {
            return this.data;
        }
        return element.children;
    }

    data: DataItem[] | undefined;

    constructor() {
        DataControl.getInstance().getLisaCommands();
        DataControl.getInstance().getLisaProjects();
    }

    loadData():void{
        // DataControl.getInstance().getLisaCommands()
        const projectsDatasource:Array<[string:any]> = DataControl.getInstance().lisaProjectJSON;
        const datasource :Array<[string:any]> = DataControl.getInstance().lisaCommandsJSON;

        var treeData: Array<TreeDataModel> = [];

        var projectsData: Array<TreeDataModel> = this.createItemTreeData(projectsDatasource);
        var commandsData: Array<TreeDataModel> = this.createItemTreeData(datasource);
        
        var projectTreeDataModel:TreeDataModel = {};
        projectTreeDataModel.id = 'project';
        projectTreeDataModel.name = '工程';
        projectTreeDataModel.description = 'lisa 工程';
        projectTreeDataModel.options = projectsData;
        treeData.push(projectTreeDataModel);

        var commandsDataModel:TreeDataModel = {};
        commandsDataModel.id = 'lisaCommands';
        commandsDataModel.name = 'lisa快捷菜单';
        commandsDataModel.description = 'lisa快捷菜单';
        commandsDataModel.options = commandsData;
        treeData.push(commandsDataModel);
       
        this.data = this.createTreeData(treeData);
    }

    createItemTreeData(datasource:Array<[string:any]>){
        var itemTreeData: Array<TreeDataModel> = [];
        datasource.forEach((json: [string:any]) => {
            var parents:TreeDataModel = {};
            for(var key in json) {
                const value = json[key];
                const isObj = Object.prototype.toString.call(value) === '[object Object]';
                //遍历对象，k即为key，obj[k]为当前k对应的值
                // console.log(`>${key}:${value}(${isObj})`);
                if (key === 'id'){ 
                    parents.id = value;
                }else if (key === 'name'){
                    parents.name = value;
                }else if (key === 'description'){
                    parents.description = value;
                }else if (key === 'options'){
                    var childTreeData: Array<TreeDataModel> = this.createItemTreeData(value);
                    parents.options = childTreeData;
                }else if (key === 'action'){
                    const action:TreeDataActionModel = {};
                    for(var key2 in value) {
                        const value3 = value[key2];
                        if (key2 === 'type'){
                            action.type = value3;
                        }else if (key2 === 'cmd'){
                            action.cmd = value3;
                        }
                    }
                    parents.action = action;      
                }
            }
            itemTreeData.push(parents);
        });
        return itemTreeData;
    }

    createTreeData(treeData:Array<TreeDataModel>){
        var mData: Array<DataItem> = [];
        //组装
        treeData.forEach((model:TreeDataModel) => {
            const optionsLength = model.options?.length ? model.options?.length : 0;
            //icon
            if (model.action){
                const type = model.action?.type;
                if (type === 'run_cmd'){
                    model.iconName = 'r_text.svg';
                }else{
                    model.iconName = 'r_link.svg';
                }
            }
            
            if (optionsLength > 0){
                var mChildData: Array<DataItem> = [];
                model.options!.forEach((childModel:TreeDataModel) => {
                    //icon
                    if (childModel.action){
                        const type = childModel.action?.type;
                        if (type == 'run_cmd'){
                            childModel.iconName = 'r_text.svg';
                        }else{
                            childModel.iconName = 'r_link.svg';
                        }
                    }

                    const childModelOptionsLength = childModel.options?.length ? childModel.options?.length : 0;
                    if (childModelOptionsLength > 0){
                        var childDataItem:DataItem = new DataItem(childModel);
                        mChildData.push(new DataItem(childModel,this.createTreeData(childModel.options!)));
                    }else{
                        var childDataItem:DataItem = new DataItem(childModel);
                        mChildData.push(childDataItem);
                    }
                });
                mData.push(new DataItem(model, mChildData));
            } else {
                mData.push(new DataItem(model));
            }
        });
        return mData;
    }
}