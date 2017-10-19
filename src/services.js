//---------------------------------------------------------------------
// <copyright file="services.ts">
//    This code is licensed under the MIT License.
//    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF 
//    ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED 
//    TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
//    PARTICULAR PURPOSE AND NONINFRINGEMENT.
// </copyright>
// <summary>Common services that can be exposed to all contributions.</summary>
//---------------------------------------------------------------------
define(["require", "exports", "VSS/Controls", "VSS/Controls/Notifications", "TFS/WorkItemTracking/RestClient", "VSS/Service"], function (require, exports, Controls, CommonControls, TFS_Wit_WebApi, VSS_Service) {
    "use strict";
    var messageService = (function () {
        function messageService() {
        }
        messageService.prototype.displayMessage = function (message, messageType) {
            var dlg = Controls.create(CommonControls.MessageAreaControl, $("#message"), null);
            dlg.setMessage(message, messageType);
            this.messenger = dlg;
        };
        messageService.prototype.closeMessage = function () {
            this.messenger.hideElement();
        };
        return messageService;
    }());
    exports.messageService = messageService;
    var queryService = (function () {
        function queryService() {
        }
        queryService.prototype.getWorkItems = function (wiQuery, fields) {
            var wits = new Array();
            var client = VSS_Service.getCollectionClient(TFS_Wit_WebApi.WorkItemTrackingHttpClient);
            var wiql = {
                query: wiQuery
            };
            return client.queryByWiql(wiql).then(function (items) {
                if (!items.workItems) {
                    throw new Error("The query supplied does not produce any work item results.");
                }
                items.workItems.forEach(function (wi) {
                    wits.push(wi.id);
                });
                return client.getWorkItems(wits, fields);
            });
        };
        queryService.prototype.getWorkItemHierarchy = function (wiQuery, fields, rootId) {
            var wits = new Array();
            var parents = new Array();
            var client = VSS_Service.getCollectionClient(TFS_Wit_WebApi.WorkItemTrackingHttpClient);
            var wiql = {
                query: wiQuery
            };
            return client.queryByWiql(wiql).then(function (items) {
                if (!items.workItemRelations) {
                    throw new Error("The query supplied does not produce any work item relations.");
                }
                items.workItemRelations.forEach(function (wi) {
                    var wir = {
                        data: {
                            id: wi.target.id,
                            name: "",
                            parent: wi.source ? wi.source.id : rootId,
                            link: wi.target.url
                        }
                    };
                    wits.push(wir);
                    parents.push(wi.target.id);
                });
                return client.getWorkItems(parents, fields).then(function (witems) {
                    witems.forEach(function (it, ix) {
                        wits.forEach(function (upd, ux) {
                            if (upd.data.id == it.id) {
                                upd.data.name = it.fields["System.Title"];
                                upd.data.workItemType = it.fields["System.WorkItemType"];
                                return;
                            }
                        });
                    });
                    return wits;
                });
            });
        };
        queryService.prototype.getWorkItemTypes = function () {
            var client = VSS_Service.getCollectionClient(TFS_Wit_WebApi.WorkItemTrackingHttpClient);
            return client.getWorkItemTypes(VSS.getWebContext().project.name);
        };
        return queryService;
    }());
    exports.queryService = queryService;
});
//# sourceMappingURL=services.js.map