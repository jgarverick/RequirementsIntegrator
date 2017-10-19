/// <reference path="services.d.ts" />
import Storage = require("Scripts/storage");
export interface HTMLFileElement extends HTMLElement {
    files: FileList;
}
export interface IRequirementsSourceAdapter {
    store: Storage.IStorageProvider;
    process(e: any, callback: Function): any;
}
export declare class flatFileAdapter implements IRequirementsSourceAdapter {
    store: Storage.IStorageProvider;
    private msg;
    private projectId;
    constructor(dataStore?: Storage.IStorageProvider);
    process(e: HTMLFileElement, callback: Function): void;
}
export declare class repositoryAdapter implements IRequirementsSourceAdapter {
    store: Storage.IStorageProvider;
    process(e: any): void;
}
