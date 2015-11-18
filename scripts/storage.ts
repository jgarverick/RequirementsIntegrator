﻿//---------------------------------------------------------------------
// <copyright file="storage.ts">
//    This code is licensed under the MIT License.
//    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF 
//    ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED 
//    TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
//    PARTICULAR PURPOSE AND NONINFRINGEMENT.
// </copyright>
// <summary>Adapters for different storage options (local storage, VSO data services).</summary>
//---------------------------------------------------------------------

/// <reference path="common.ts" />
import Services = require("Scripts/services");
import Utilities = require("Scripts/utilities");
import CommonControls = require("VSS/Controls/Notifications");
import Common = require("Scripts/common");

export interface IStorageProvider {
    getCollection(collectionId: string, callback: Function);
    setCollection(id: string, value: string);
    clear();
    remove(id: string);
    messenger: Services.messageService;
}

export class LocalStorageAdapter implements IStorageProvider {
    messenger: Services.messageService;

    constructor() {
        this.messenger = new Services.messageService();
    }

    getCollection(id: string, callback: Function) {
            var item: string = localStorage.getItem(id);
            if (item.length < 1) {
                this.messenger.displayMessage(`Item '${id}' could not be located or has no value.`, CommonControls.MessageAreaType.Warning);

            }
            if (callback) {
                callback(item);
                return null;
            } else
                return item;
        
    }

    setCollection(id: string, value: string) {
            localStorage.setItem(id, value);
            this.messenger.displayMessage(`Item '${id}' added/updated.`, CommonControls.MessageAreaType.Info);
        
    }

    clear() {
       
            localStorage.clear();
            this.messenger.displayMessage("Local storage has been cleared.", CommonControls.MessageAreaType.Info);
        
    }

    remove(id: string) {
        
            localStorage.removeItem(id);
            this.messenger.displayMessage(`Item '${id}' removed.`, CommonControls.MessageAreaType.Info);
      
    }
}

export class VsoDocumentServiceAdapter implements IStorageProvider {
    private scope: string;
    messenger: Services.messageService;
    private dataService: IPromise<IExtensionDataService>;

    constructor(serviceScope: string) {
        this.scope = serviceScope || "ProjectCollection";
        this.messenger = new Services.messageService();
        this.dataService = VSS.getService(VSS.ServiceIds.ExtensionData);
    }

    getCollection(id: string, callback: Function) {
        var self = this;

        if (callback === undefined) {
            throw new Error("This method requires a callback function.");
        }
        self.dataService.then((dataService: IExtensionDataService) => {
            dataService.getDocument("RequirementsManagement", id).then((doc) => {
                callback(doc.json);
            }, (error) => {
               self.messenger.displayMessage("It appears you do not have any requirements.  Please use the Import button to add requirements.", CommonControls.MessageAreaType.Info);
            });
        });


    }

    setCollection(id: string, value: any) {
        var self = this;
        var item = { id: id, json: value };


        self.dataService.then((dataService: IExtensionDataService) => {
            dataService.setDocument("RequirementsManagement", item).then((doc) => {
                return doc;
            }, (error) => {
                self.messenger.displayMessage(error.message, CommonControls.MessageAreaType.Error);
            });
        });

    }

    clear() {
        var self = this;

        self.dataService.then((dataService: IExtensionDataService) => {
            dataService.getDocuments("RequirementsManagement").then((docs) => {
                docs.forEach((item, index, docs) => {
                    dataService.deleteDocument("RequirementsManagement", item.id).then((doc) => {
                        // intentionally blank
                    });
                });
                self.messenger.displayMessage("All documents successfully removed.", CommonControls.MessageAreaType.Info);
            });

        });

    }

    remove(id: string) {
        var self = this;

        self.dataService.then((dataService: IExtensionDataService) => {
            dataService.deleteDocument("RequirementsManagement", id).then(() => {
                //self.messenger.displayMessage(`Item '${id}' successfully deleted.`, CommonControls.MessageAreaType.Info);
            }, (reason) => {
                var error = <Error>JSON.parse(reason.responseText);
                self.messenger.displayMessage(error.message, CommonControls.MessageAreaType.Error);
            });
        });

    }
}

export class VsoSettingsServiceAdapter implements IStorageProvider {
    private scope: string;
    messenger: Services.messageService;
    private dataService: IPromise<IExtensionDataService>;

    constructor(serviceScope: string) {
        this.scope = serviceScope;
        this.messenger = new Services.messageService();
        this.dataService = VSS.getService(VSS.ServiceIds.ExtensionData);
    }

    getCollection(id: string, callback: Function) {
        var self = this;
        if (callback === undefined) {
            throw new Error("This method requires a callback function.");
        }
        Utilities.executeBoundary(() => {
            self.dataService.then((dataService: IExtensionDataService) => {
                dataService.getValue(id).then((doc) => {
                    callback(doc);
                });
            });
        });
    }

    setCollection(id: string, value: string) {
        var self = this;
        Utilities.executeBoundary(() => {
            self.dataService.then((dataService: IExtensionDataService) => {
                dataService.setValue(id, value).then((doc) => {
                    return true;
                });
            });
        });
    }

    clear() {
        var self = this;
        Utilities.executeBoundary(() => {
            throw Error("Method not implemented.");
        });
    }

    remove(id: string) {
        var self = this;
        Utilities.executeBoundary(() => {
            self.setCollection(id, null);
        });
    }
}