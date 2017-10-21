//---------------------------------------------------------------------
// <copyright file="mappingDialog.ts">
//    This code is licensed under the MIT License.
//    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF 
//    ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED 
//    TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
//    PARTICULAR PURPOSE AND NONINFRINGEMENT.
// </copyright>
// <summary>Backing model for the mapping dialog view.</summary>
//---------------------------------------------------------------------
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "VSS/Controls", "VSS/Controls/Grids", "src/services", "VSS/Controls/Dialogs", "VSS/Controls/Notifications"], function (require, exports, Controls, Grids, Services, Dialogs, CommonControls) {
    "use strict";
    var selectedItems;
    var MappingDialog = (function (_super) {
        __extends(MappingDialog, _super);
        function MappingDialog(context) {
            _super.call(this);
            var self = this;
            self.context = context;
            self.messenger = new Services.MessageService();
            $("#workItemType").on("change", self.getItems);
        }
        MappingDialog.prototype.getItems = function (e) {
            var messenger = new Services.MessageService();
            $("#mappingContent").html("").hide();
            var qs = new Services.QueryService();
            // Now call in and get the details
            qs.getWorkItems("select * from WorkItems where [System.WorkItemType] = '" + $("#workItemType").val() + "' AND [System.TeamProject] = '" + VSS.getWebContext().project.name + "'", ["System.Title", "System.WorkItemType"]).then(function (results) {
                var container = $("#mappingContent");
                var mappedItems = new Array();
                results.forEach(function (r) {
                    var item = { id: 0, title: "", type: "" };
                    item.id = r.id;
                    item.title = r.fields["System.Title"];
                    item.type = r.fields["System.WorkItemType"];
                    mappedItems.push(item);
                });
                container.html("");
                var grid = Controls.create(Grids.Grid, container, {
                    width: "100%",
                    height: "200px",
                    lastCellFillsRemainingContent: true,
                    openRowDetail: function (index) {
                        var item = grid.getRowData(index);
                        window.open(VSS.getWebContext().host.uri + "/" + VSS.getWebContext().project.name + "/_workitems#_a=edit&id=" + item.id + "&fullScreen=true", "_blank");
                    },
                    columns: [
                        {
                            text: "Select",
                            width: 50,
                            index: "",
                            getCellContents: function (rowInfo, dataIndex, expandedState, level, column, indentIndex, columnOrder) {
                                var chk = $("<input class='reqt-select' type='checkbox' />").val(grid.getColumnValue(dataIndex, "id"));
                                chk.on('click', function (e) {
                                    var input = e.target;
                                    if (input.checked) {
                                        selectedItems.push(input.value);
                                    }
                                    else {
                                        selectedItems = selectedItems.filter(function (item) { return item != input.value; });
                                    }
                                });
                                var cell = $("<div class='grid-cell total'></div>");
                                cell.width(column.width || 100).append(chk);
                                return cell.append(chk);
                            }
                        },
                        { text: "ID", index: "id", width: 35 },
                        { text: "Title", index: "title", width: 275 }
                    ],
                    source: mappedItems
                });
            }, function (e) {
                messenger.displayMessage(e.message, CommonControls.MessageAreaType.Error);
            });
            $("#mappingContent").show();
        };
        MappingDialog.prototype.start = function (id) {
            var self = this;
            self.requirementId = id;
            // Grab the project work item types
            var qs = new Services.QueryService();
            qs.getWorkItemTypes().then(function (types) {
                $("#workItemType").html("");
                types.filter(function (x) {
                    return x.name.match("Test") == null && x.name.match("Shared") == null
                        && x.name.match("Feedback") == null && x.name.match("Code Review") == null;
                }).forEach(function (item) {
                    $("#workItemType").append($("<option />").text(item.name).val(item.name));
                });
                $("#workItemTypeGroup").show();
            }, function (e) {
                self.messenger.displayMessage(e.message, CommonControls.MessageAreaType.Error);
            });
        };
        MappingDialog.prototype.save = function () {
            var self = this;
            return selectedItems.join(",");
        };
        return MappingDialog;
    }(Dialogs.ModalDialog));
    exports.MappingDialog = MappingDialog;
    selectedItems = new Array();
    exports.dlg = new MappingDialog();
});
//# sourceMappingURL=mappingDialog.js.map