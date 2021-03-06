﻿// ---------------------------------------------------------------------
// <copyright file="services.ts">
//    This code is licensed under the MIT License.
//    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF
//    ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
//    TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
//    PARTICULAR PURPOSE AND NONINFRINGEMENT.
// </copyright>
// <summary>Common services that can be exposed to all contributions.</summary>
// ---------------------------------------------------------------------

import Common = require("common");
import Controls = require("VSS/Controls");
import CommonControls = require("VSS/Controls/Notifications");
import TFS_Wit_WebApi = require("TFS/WorkItemTracking/RestClient");
import VSS_Service = require("VSS/Service");
import Contracts = require("TFS/WorkItemTracking/Contracts");

export class MessageService {
    messenger: CommonControls.MessageAreaControl;

    displayMessage(message: string, messageType: CommonControls.MessageAreaType) {
        $("#message").html("");
        let dlg = Controls.create(CommonControls.MessageAreaControl, $("#message"), null);
        dlg.setMessage(message, messageType);
        this.messenger = dlg;

    }

    closeMessage() {
        this.messenger.hideElement();
    }
}

export class QueryService {
    getWorkItems(wiQuery: string, fields: string[]): IPromise<Contracts.WorkItem[]>  {

        let wits = new Array<any>();
        let client = VSS_Service.getCollectionClient(TFS_Wit_WebApi.WorkItemTrackingHttpClient);
        let wiql: Common.Wiql = {
            query: wiQuery
        };

        return client.queryByWiql(<Common.Wiql>wiql).then((items) => {
            if (!items.workItems) {
                throw new Error("The query supplied does not produce any work item results.");
            }
                items.workItems.forEach((wi) => {
                    wits.push(wi.id);
                });
            return client.getWorkItems(wits, fields);
        });
    }

    getWorkItemHierarchy(wiQuery: string, fields: string[], rootId: string) {
        let wits = new Array<any>();
        let parents = new Array<any>();
        let client = VSS_Service.getCollectionClient(TFS_Wit_WebApi.WorkItemTrackingHttpClient);
        let wiql: Common.Wiql = {
            query: wiQuery
        };

        return client.queryByWiql(<Common.Wiql>wiql).then((items) => {

            if (!items.workItemRelations) {
                throw new Error("The query supplied does not produce any work item relations.");
            }
            items.workItemRelations.forEach((wi) => {
                let wir = {
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

            return client.getWorkItems(parents, fields).then((witems) => {
                witems.forEach((it, ix) => {
                    wits.forEach((upd, ux) => {
                        if (upd.data.id === it.id) {
                            upd.data.name = it.fields["System.Title"];
                            upd.data.workItemType = it.fields["System.WorkItemType"];
                            return;
                        }
                    });
                });

                return wits;
            });

        });
    }

    getWorkItemTypes(): IPromise<Contracts.WorkItemType[]> {
        let client = VSS_Service.getCollectionClient(TFS_Wit_WebApi.WorkItemTrackingHttpClient);
        return client.getWorkItemTypes(VSS.getWebContext().project.name);

    }
}