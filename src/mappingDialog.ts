// ---------------------------------------------------------------------
// <copyright file="mappingDialog.ts">
//    This code is licensed under the MIT License.
//    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF
//    ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
//    TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
//    PARTICULAR PURPOSE AND NONINFRINGEMENT.
// </copyright>
// <summary>Backing model for the mapping dialog view.</summary>
// ---------------------------------------------------------------------

import Storage = require("storage");
import Controls = require("VSS/Controls");
import Grids = require("VSS/Controls/Grids");
import Services = require("services");
import Dialogs = require("VSS/Controls/Dialogs");
import CommonControls = require("VSS/Controls/Notifications");
import Adapters = require("adapters");
import Common = require("common");

let selectedItems: Array<string>;

export class MappingDialog extends Dialogs.ModalDialog {
    messenger: Services.MessageService;
    adapter: Adapters.IRequirementsSourceAdapter;
    context: WebContext;
    requirementId: string;

    constructor(context?: WebContext) {
        super();
        let self = this;
        self.context = context;
        self.messenger = new Services.MessageService();
        $("#workItemType").on("change", self.getItems);
    }

    getItems(e: any) {
        let messenger = new Services.MessageService();
        $("#mappingContent").html("").hide();
        let qs = new Services.QueryService();

        // Now call in and get the details
        qs.getWorkItems("select * from WorkItems where [System.WorkItemType] = '" + $("#workItemType").val() + "' AND [System.TeamProject] = '" + VSS.getWebContext().project.name + "'",
            ["System.Title", "System.WorkItemType"]).then((results) => {
                let container = $("#mappingContent");
                let mappedItems = new Array<any>();

                if (results.length === 0) {
                    throw "No work items found for the type selected.";
                }
                results.forEach((r) => {
                    let item = { id: 0, title: "", type: "" };
                    item.id = r.id;
                    item.title = r.fields["System.Title"];
                    item.type = r.fields["System.WorkItemType"];
                    mappedItems.push(item);
                });
                container.html("");
                $("#message").html("");
                let grid = Controls.create<Grids.Grid, Grids.IGridOptions>(Grids.Grid, container, {
                    width: "100%",
                    height: "200px",
                    lastCellFillsRemainingContent: true,
                    openRowDetail: (index: number) => {
                        let item = grid.getRowData(index);
                        window.open(VSS.getWebContext().host.uri + "/" + VSS.getWebContext().project.name + "/_workitems#_a=edit&id=" + item.id + "&fullScreen=true", "_blank");
                    },
                    columns: [
                        {
                            text: "Select",
                            width: 50,
                            index: "",
                            getCellContents: (rowInfo, dataIndex, expandedState, level, column, indentIndex, columnOrder) => {
                                let chk = $("<input class='reqt-select' type='checkbox' />").val(grid.getColumnValue(dataIndex, "id"));
                                chk.on("click", (e) => {
                                    let input: HTMLInputElement = <HTMLInputElement>e.target;
                                    if (input.checked) {
                                        selectedItems.push(input.value);
                                    } else {
                                        selectedItems = selectedItems.filter((item) => { return item !== input.value; });
                                    }
                                });
                                let cell = $("<div class='grid-cell total'></div>");
                                cell.width(column.width || 100).append(chk);
                                return cell.append(chk);
                            }
                        },
                        { text: "ID", index: "id", width: 35 },
                        { text: "Title", index: "title", width: 275 }
                    ],
                    source: mappedItems
                });
        }, (e) => {
            let msg = "";
            if (e.message.startsWith("400")) {
                msg = "No work items found for this type.";
            } else {
                msg = e.message;
            }
            messenger.displayMessage(msg, CommonControls.MessageAreaType.Error);
        });
        $("#mappingContent").show();
    }

    start(id: string) {
        let self = this;
        self.requirementId = id;
        // Grab the project work item types
        let qs = new Services.QueryService();
        qs.getWorkItemTypes().then((types) => {
            $("#workItemType").html("");
            types.filter((x) => {
                return x.name.match("Test") == null && x.name.match("Shared") == null
                    && x.name.match("Feedback") == null && x.name.match("Code Review") == null;
            }).forEach((item) => {
                $("#workItemType").append($("<option />").text(item.name).val(item.name));
            });

            $("#workItemTypeGroup").show();
        }, (e) => {
            self.messenger.displayMessage(e.message, CommonControls.MessageAreaType.Error);

        });
    }

    save() {
        let self = this;
        return selectedItems.join(",");
    }
}

selectedItems = new Array<any>();
exports.dlg = new MappingDialog();