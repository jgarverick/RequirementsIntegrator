/// <reference path="ref/VSS.d.ts" />
import CommonControls = require("VSS/Controls/Notifications");
import Contracts = require("TFS/WorkItemTracking/Contracts");
export declare class messageService {
    messenger: CommonControls.MessageAreaControl;
    displayMessage(message: string, messageType: CommonControls.MessageAreaType): void;
    closeMessage(): void;
}
export declare class queryService {
    getWorkItems(wiQuery: string, fields: string[]): IPromise<Contracts.WorkItem[]>;
    getWorkItemHierarchy(wiQuery: string, fields: string[], rootId: string): IPromise<any[]>;
    getWorkItemTypes(): IPromise<Contracts.WorkItemType[]>;
}
