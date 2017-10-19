import Storage = require("Scripts/storage");
import Services = require("Scripts/services");
import Treeview = require("VSS/Controls/TreeView");
export interface IAppInit {
    start(): any;
}
export interface IStorageInit extends IAppInit {
    store: Storage.IStorageProvider;
}
export interface Wiql {
    query: string;
}
export interface Requirement {
    RequirementId: string;
    Title: string;
    Description: string;
    MappedItems: string;
}
export interface ICollection<T> {
    add(item: T): any;
    remove(item: T): any;
    update(item: T): any;
    toString(): any;
}
export declare class RequirementCollection implements ICollection<Requirement> {
    private list;
    constructor(source: string);
    add(item: Requirement): void;
    remove(item: Requirement): void;
    update(item: Requirement): void;
    toString(): string;
    getItem(id: string): Requirement;
}
export declare class ViewModelBase {
    processTemplate: string;
    projectId: string;
    messenger: Services.messageService;
    tree: Treeview.TreeView;
    nodes: Array<Treeview.TreeNode>;
    constructor();
    setActiveNode(nodeText: string): void;
    validateTemplate(callback: Function): void;
}
