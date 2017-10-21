// ---------------------------------------------------------------------
// <copyright file="visualizerDialog.ts">
//    This code is licensed under the MIT License.
//    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF
//    ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
//    TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
//    PARTICULAR PURPOSE AND NONINFRINGEMENT.
// </copyright>
// <summary>Backing model for the requirements visualization dialog view.
// Original code for using D3 can be found at:
// http://www.d3noob.org/2014/01/tree-diagrams-in-d3js_11.html
// </summary>
// ---------------------------------------------------------------------

/// <reference path="ref/xlsx.d.ts" />
/// <reference path="adapters.ts" />

import Storage = require("../src/storage");
import Services = require("../src/services");
import CommonControls = require("VSS/Controls/Notifications");
import Dialogs = require("VSS/Controls/Dialogs");
import Adapters = require("../src/adapters");
import Common = require("../src/common");
import Contracts = require("TFS/WorkItemTracking/Contracts");

let dataNodes = [],
    dataEdges = [];
export class VisualizerDialog extends Dialogs.ModalDialog {
    messenger: Services.MessageService;
    adapter: Adapters.IRequirementsSourceAdapter;
    context: WebContext;
    cytoscape: any;
    mappedItems: Array<string>;

    constructor(context?: WebContext, cy?: any) {
        super();
        let self = this;
        self.cytoscape = cy;
        self.context = context;
        self.messenger = new Services.MessageService();
        self.adapter = new Adapters.FlatFileAdapter(new Storage.VsoDocumentServiceAdapter("ProjectCollection"));
    }

    start(item: Common.Requirement) {
        let self = this;
        if (item.MappedItems === null || item.MappedItems === "") {
            self.messenger.displayMessage("There are no work items mapped to this requirement.", CommonControls.MessageAreaType.Error);
            return false;
        }
        self.mappedItems = item.MappedItems.split(",");
        let qs = new Services.QueryService();
        qs.getWorkItemHierarchy("select [System.Id], [System.WorkItemType], [System.Title], [System.State], " +
            "[System.AreaPath], [System.IterationPath], [System.Tags] from WorkItemLinks where" +
            " (Source.[System.TeamProject] = '" + VSS.getWebContext().project.name +
            "' and (Source.[System.Id] in (" + item.MappedItems
            + ") or Source.[System.WorkItemType] = 'Feature' or Source.[System.WorkItemType] = 'Epic'))" +
            " and ([System.Links.LinkType] = 'System.LinkTypes.Hierarchy-Forward') and " +
            "(Target.[System.TeamProject] = '" + VSS.getWebContext().project.name + "' and Target.[System.WorkItemType] <> '') order by " +
            "[System.ChangedDate] desc mode (Recursive)",
            ["System.WorkItemType", "System.Title", "System.State", "System.WorkItemType"], item.RequirementId)
            .then((results) => {
                let output = [];
                let rootItem = {
                    data: {
                        id: item.RequirementId,
                        name: item.Title,
                        bkcolor: "darkgreen"
                    }
                };
                output.push(rootItem);
                results.forEach((itm, idx) => {
                    let bkColor = itm.data.workItemType;
                    switch (bkColor) {
                        case "Product Backlog Item":
                            itm.data.bkcolor = "lightblue";
                            break;
                        case "Feature":
                            itm.data.bkcolor = "purple";
                            break;
                        case "Task":
                            itm.data.bkcolor = "goldenrod";
                            break;
                        default:
                            itm.data.bkcolor = "lightgray";
                            break;
                    }

                    output.push(itm);
                });

                self.createHierarchy(output);
                self.visualize();
            });

    }

    visualize() {
        let self = this;

        let cy = self.cytoscape({
            container: $("#cy")[0],

            style: self.cytoscape.stylesheet()
                .selector("node")
                .css({
                    "shape": "rectangle",
                    "width": "200px",
                    "height": "75px",
                    "content": "data(name)",
                    "text-valign": "center",
                    "color": "white",
                    "text-outline-color": "white",
                    "background-color": "data(bkcolor)",
                    "border-color": "data(bordercolor)",
                    "border-width": "data(borderwidth)",
                    "text-wrap": "wrap",
                    "text-max-width": "185px",
                    "border-radius": "6px",
                    "line-color": "black"
                })
                .selector(":selected")
                .css({
                    "line-color": "blue",
                    "target-arrow-color": "black",
                    "source-arrow-color": "black",
                    "text-outline-color": "black",
                    "border-width": "2px"
                }),

            elements: {
                nodes: dataNodes,
                edges: dataEdges
            },

            layout: {
                name: "dagre",
                padding: 10
            }
        });

        cy.on("tap", "node", function () {
            try { // your browser may block popups
                window.open(this.data("link"));
            } catch (e) { // fall back on url change
                window.location.href = this.data("link");
            }
        });

    }

    createHierarchy(data: any) {
        let self = this;
        let dataMap = data.reduce((map, node) => {
            map[node.data.id] = node;
            return map;
        }, {});
        let projectUrl = VSS.getWebContext().collection.uri + "/" + VSS.getWebContext().project.name;
        data.forEach((node) => {
            // add to parent
            let dataNode = {
                data: {
                    id: node.data.id,
                    name: node.data.name,
                    description: node.data.Description,
                    link: projectUrl + "/_workitems#_a=edit&id=" + node.data.id + "&fullScreen=true",
                    bkcolor: node.data.bkcolor,
                    bordercolor: self.mappedItems.indexOf(node.data.id.toString()) < 0 ? "black" : "darkgreen",
                    borderwidth: self.mappedItems.indexOf(node.data.id.toString()) < 0 ? "1px" : "8px"
                }
            };
            dataNodes.push(dataNode);

            let parent = dataMap[node.data.parent];
            if (parent) {
                // create child array if it doesn't exist
                let edge = {
                    data: {
                        source: parent.data.id,
                        target: node.data.id
                    }
                };
                dataEdges.push(edge);
            } else {
                // parent is null or missing
            }

        });

    }

}

// exports.dlg = new VisualizerDialog();