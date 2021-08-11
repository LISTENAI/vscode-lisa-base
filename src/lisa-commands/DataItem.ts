import { TreeItem, TreeItemCollapsibleState, Uri } from "vscode";
import * as path from 'path';

// 创建每一项 label 对应的图片名称
// 其实就是一个Map集合，用 ts 的写法
const ITEM_ICON_MAP = new Map<string, string>([
    ['text', 'r_text.svg'],
    ['link', 'r_link.svg']
]);
export interface TreeDataActionModel {
    type?: string;
    cmd?: string;
}
export interface TreeDataModel {
    id?: string;
    name?: string;
    iconName?: string;
    description?: string;
    options?: Array<TreeDataModel>;
    action?: TreeDataActionModel;
}
export class DataItem extends TreeItem{

    public children: DataItem[] | undefined;
    
    // constructor(label: string, children?: DataItem[] | undefined) {
    //     super(label, children === undefined ? TreeItemCollapsibleState.None : TreeItemCollapsibleState.Collapsed);
    //     this.children = children;
    // }

    constructor(treeModel: TreeDataModel | undefined, children?: DataItem[] | undefined) {
        super(treeModel?.name ? treeModel?.name:"没有找到节点", children === undefined ? TreeItemCollapsibleState.None : TreeItemCollapsibleState.Collapsed);
        this.children = children;
        if (treeModel?.iconName !== undefined) {
            this.iconPath = DataItem.getIconUriForLabel(treeModel.iconName!);
        }  

        if (children == null || children == undefined || children?.length == 0){
            this.command = {
                title: treeModel?.name ? treeModel?.name:"没有找到节点",
                command: 'lisa.tree.onClick',
                arguments: [
                    treeModel?.id,
                    treeModel?.name,
                    treeModel?.action,
                    treeModel?.options,
                    treeModel?.description
                ],
            };
        }
    
        this.tooltip = treeModel?.description ? treeModel?.description : "点击查看详情";
    }
    
    static getIconUriForLabel(iconName: string):Uri {
        let iconPath = path.join(__dirname, '..', '..' ,'assets' ,'icons', iconName);
        return Uri.file(iconPath);
    }
}

