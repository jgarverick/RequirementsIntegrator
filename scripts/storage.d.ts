/// <reference path="common.d.ts" />
import Services = require("Scripts/services");
export interface IStorageProvider {
    getCollection(collectionId: string, callback: Function): any;
    setCollection(id: string, value: string): any;
    clear(): any;
    remove(id: string): any;
    messenger: Services.messageService;
}
export declare class LocalStorageAdapter implements IStorageProvider {
    messenger: Services.messageService;
    constructor();
    getCollection(id: string, callback: Function): string;
    setCollection(id: string, value: string): void;
    clear(): void;
    remove(id: string): void;
}
export declare class VsoDocumentServiceAdapter implements IStorageProvider {
    private scope;
    messenger: Services.messageService;
    private dataService;
    constructor(serviceScope: string);
    getCollection(id: string, callback: Function): void;
    setCollection(id: string, value: any): void;
    clear(): void;
    remove(id: string): void;
}
export declare class VsoSettingsServiceAdapter implements IStorageProvider {
    private scope;
    messenger: Services.messageService;
    private dataService;
    constructor(serviceScope: string);
    getCollection(id: string, callback: Function): void;
    setCollection(id: string, value: string): void;
    clear(): void;
    remove(id: string): void;
}
