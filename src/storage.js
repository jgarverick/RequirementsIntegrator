//---------------------------------------------------------------------
// <copyright file="storage.ts">
//    This code is licensed under the MIT License.
//    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF 
//    ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED 
//    TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
//    PARTICULAR PURPOSE AND NONINFRINGEMENT.
// </copyright>
// <summary>Adapters for different storage options (local storage, VSO data services).</summary>
//---------------------------------------------------------------------
define(["require", "exports", "Scripts/services", "Scripts/utilities", "VSS/Controls/Notifications"], function (require, exports, Services, Utilities, CommonControls) {
    "use strict";
    var LocalStorageAdapter = (function () {
        function LocalStorageAdapter() {
            this.messenger = new Services.messageService();
        }
        LocalStorageAdapter.prototype.getCollection = function (id, callback) {
            var item = localStorage.getItem(id);
            if (item.length < 1) {
                this.messenger.displayMessage("Item '" + id + "' could not be located or has no value.", CommonControls.MessageAreaType.Warning);
            }
            if (callback) {
                callback(item);
                return null;
            }
            else
                return item;
        };
        LocalStorageAdapter.prototype.setCollection = function (id, value) {
            localStorage.setItem(id, value);
            this.messenger.displayMessage("Item '" + id + "' added/updated.", CommonControls.MessageAreaType.Info);
        };
        LocalStorageAdapter.prototype.clear = function () {
            localStorage.clear();
            this.messenger.displayMessage("Local storage has been cleared.", CommonControls.MessageAreaType.Info);
        };
        LocalStorageAdapter.prototype.remove = function (id) {
            localStorage.removeItem(id);
            this.messenger.displayMessage("Item '" + id + "' removed.", CommonControls.MessageAreaType.Info);
        };
        return LocalStorageAdapter;
    }());
    exports.LocalStorageAdapter = LocalStorageAdapter;
    var VsoDocumentServiceAdapter = (function () {
        function VsoDocumentServiceAdapter(serviceScope) {
            this.scope = serviceScope || "ProjectCollection";
            this.messenger = new Services.messageService();
            this.dataService = VSS.getService(VSS.ServiceIds.ExtensionData);
        }
        VsoDocumentServiceAdapter.prototype.getCollection = function (id, callback) {
            var self = this;
            if (callback === undefined) {
                throw new Error("This method requires a callback function.");
            }
            self.dataService.then(function (dataService) {
                dataService.getDocument("RequirementsManagement", id).then(function (doc) {
                    callback(doc.json);
                }, function (error) {
                    self.messenger.displayMessage("It appears you do not have any requirements.  Please use the Import button to add requirements.", CommonControls.MessageAreaType.Info);
                });
            });
        };
        VsoDocumentServiceAdapter.prototype.setCollection = function (id, value) {
            var self = this;
            var item = { id: id, json: value };
            self.dataService.then(function (dataService) {
                dataService.setDocument("RequirementsManagement", item).then(function (doc) {
                    return doc;
                }, function (error) {
                    self.messenger.displayMessage(error.message, CommonControls.MessageAreaType.Error);
                });
            });
        };
        VsoDocumentServiceAdapter.prototype.clear = function () {
            var self = this;
            self.dataService.then(function (dataService) {
                dataService.getDocuments("RequirementsManagement").then(function (docs) {
                    docs.forEach(function (item, index, docs) {
                        dataService.deleteDocument("RequirementsManagement", item.id).then(function (doc) {
                            // intentionally blank
                        });
                    });
                    self.messenger.displayMessage("All documents successfully removed.", CommonControls.MessageAreaType.Info);
                });
            });
        };
        VsoDocumentServiceAdapter.prototype.remove = function (id) {
            var self = this;
            self.dataService.then(function (dataService) {
                dataService.deleteDocument("RequirementsManagement", id).then(function () {
                    //self.messenger.displayMessage(`Item '${id}' successfully deleted.`, CommonControls.MessageAreaType.Info);
                }, function (reason) {
                    var error = JSON.parse(reason.responseText);
                    self.messenger.displayMessage(error.message, CommonControls.MessageAreaType.Error);
                });
            });
        };
        return VsoDocumentServiceAdapter;
    }());
    exports.VsoDocumentServiceAdapter = VsoDocumentServiceAdapter;
    var VsoSettingsServiceAdapter = (function () {
        function VsoSettingsServiceAdapter(serviceScope) {
            this.scope = serviceScope;
            this.messenger = new Services.messageService();
            this.dataService = VSS.getService(VSS.ServiceIds.ExtensionData);
        }
        VsoSettingsServiceAdapter.prototype.getCollection = function (id, callback) {
            var self = this;
            if (callback === undefined) {
                throw new Error("This method requires a callback function.");
            }
            Utilities.executeBoundary(function () {
                self.dataService.then(function (dataService) {
                    dataService.getValue(id).then(function (doc) {
                        callback(doc);
                    });
                });
            });
        };
        VsoSettingsServiceAdapter.prototype.setCollection = function (id, value) {
            var self = this;
            Utilities.executeBoundary(function () {
                self.dataService.then(function (dataService) {
                    dataService.setValue(id, value).then(function (doc) {
                        return true;
                    });
                });
            });
        };
        VsoSettingsServiceAdapter.prototype.clear = function () {
            var self = this;
            Utilities.executeBoundary(function () {
                throw Error("Method not implemented.");
            });
        };
        VsoSettingsServiceAdapter.prototype.remove = function (id) {
            var self = this;
            Utilities.executeBoundary(function () {
                self.setCollection(id, null);
            });
        };
        return VsoSettingsServiceAdapter;
    }());
    exports.VsoSettingsServiceAdapter = VsoSettingsServiceAdapter;
});
//# sourceMappingURL=storage.js.map