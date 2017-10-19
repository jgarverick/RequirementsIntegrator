var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "Scripts/adapters", "Scripts/utilities", "Scripts/storage", "Scripts/common", "VSS/Controls", "VSS/Controls/Menus", "VSS/Controls/Notifications"], function (require, exports, Adapters, Utilities, Storage, Common, Controls, Menus, CommonControls) {
    "use strict";
    var rMapper;
    (function (rMapper) {
        var Core;
        (function (Core) {
            var Mapper = (function (_super) {
                __extends(Mapper, _super);
                function Mapper(adapter) {
                    var _this = this;
                    _super.call(this);
                    var self = this;
                    self.adapter = adapter;
                    $('#reqTitle').text("Requirements");
                    self.setActiveNode($('#reqTitle').text());
                    self.menu = Controls.create(Menus.MenuBar, $('#reqtMenu'), {
                        items: [
                            {
                                id: "importButton",
                                text: "Import",
                                icon: "icon-import-reqt",
                                title: "Imports requirements into the system"
                            }, {
                                id: "exportButton",
                                text: "Export",
                                icon: "icon-export-reqt",
                                disabled: true,
                                title: "Exports the requirements into an Excel document"
                            },
                            {
                                id: "clearButton",
                                text: "Delete Requirements",
                                icon: "icon-delete",
                                disabled: true,
                                title: "Deletes all requirements and mappings"
                            }],
                        executeAction: function (args) {
                            var command = args.get_commandName();
                            switch (command) {
                                case "clearButton":
                                    self.clearRequirements();
                                    break;
                                case "importButton":
                                    self.showImportDialog();
                                    break;
                                case "exportButton":
                                    _this.adapter.store.getCollection(self.projectId + "-requirements", function (reqt) {
                                        Utilities.exportToExcel(reqt, { bookType: 'xlsx', bookSST: true, type: 'binary' });
                                    });
                                    break;
                            }
                        }
                    });
                }
                Mapper.prototype.start = function () {
                    var _this = this;
                    var self = this;
                    // Initial query/load of data
                    setTimeout(function () {
                        self.validateTemplate(function () {
                            _this.adapter.store.getCollection(self.projectId + "-requirements", function (reqt) {
                                self.getRequirements(reqt);
                            });
                        });
                    }, 750);
                };
                Mapper.prototype.getRequirements = function (reqt) {
                    var self = this;
                    var importItem = self.menu.getItem("importButton");
                    var exportItem = self.menu.getItem("exportButton");
                    var clearItem = self.menu.getItem("clearButton");
                    function menuItemClick(args) {
                        // Get the item associated with the context menu
                        var reqt = args.get_commandArgument().item;
                        switch (args.get_commandName()) {
                            case "map":
                                self.showMappingDialog(reqt.RequirementId);
                                break;
                            case "visualize":
                                self.showVisualizationDialog(reqt);
                                break;
                        }
                    }
                    function getContextMenuItems() {
                        return [
                            {
                                id: "map",
                                text: "Map Work Item(s)"
                            },
                            { separator: true },
                            {
                                id: "visualize",
                                text: "Visualize Requirement",
                                icon: "icon-compare"
                            },
                        ];
                    }
                    if (reqt != null) {
                        $("#content").html("");
                        require(["VSS/Controls", "VSS/Controls/Grids"], function (Controls, Grids) {
                            self.grid = Controls.create(Grids.Grid, $("#content"), {
                                height: "300px",
                                gutter: {
                                    contextMenu: true
                                },
                                contextMenu: {
                                    items: getContextMenuItems(),
                                    executeAction: menuItemClick,
                                    arguments: function (contextInfo) {
                                        return { item: contextInfo.item };
                                    }
                                },
                                columns: [
                                    { text: "ID", index: "RequirementId", width: 75 },
                                    { text: "Title", index: "Title", width: 200 },
                                    { text: "Description", index: "Description", width: 500 },
                                ],
                                openRowDetail: function (index) {
                                    var req = self.grid.getRowData(index);
                                    self.showMappingDialog(req.RequirementId);
                                },
                                source: JSON.parse(reqt)
                            });
                        });
                        $("#content").show();
                        self.menu.updateCommandStates([
                            { id: "importButton", disabled: !(importItem.getCommandState() & Menus.MenuItemState.Disabled) },
                            { id: "exportButton", disabled: !(exportItem.getCommandState() & Menus.MenuItemState.Disabled) },
                            { id: "clearButton", disabled: !(clearItem.getCommandState() & Menus.MenuItemState.Disabled) }
                        ]);
                        setTimeout(function () {
                            $("a.mapButton").on("click", function (e) {
                                e.preventDefault();
                                self.showMappingDialog($(e.currentTarget).attr("req"));
                            });
                        }, 500);
                    }
                    else {
                        self.menu.updateCommandStates([
                            { id: "importButton", disabled: !(importItem.getCommandState() & Menus.MenuItemState.Disabled) },
                            { id: "exportButton", disabled: !(exportItem.getCommandState() & Menus.MenuItemState.Disabled) },
                            { id: "clearButton", disabled: !(clearItem.getCommandState() & Menus.MenuItemState.Disabled) }
                        ]);
                        self.messenger.displayMessage("It appears you do not have any requirements.  Please use the Import button to add requirements.", CommonControls.MessageAreaType.Info);
                    }
                };
                Mapper.prototype.showVisualizationDialog = function (req) {
                    var self = this;
                    var createVizDialog;
                    var opts = {
                        width: 800,
                        height: 600,
                        buttons: null,
                        title: "Visualize Requirement: " + req.RequirementId
                    };
                    VSS.getService(VSS.ServiceIds.Dialog).then(function (dlg) {
                        dlg.openDialog(VSS.getExtensionContext().publisherId + "." + VSS.getExtensionContext().extensionId + ".visualizerDialog", opts).then(function (dialog) {
                            dialog.getContributionInstance("createVisualizerDialog").then(function (ci) {
                                createVizDialog = ci;
                                createVizDialog.start(req);
                            }, function (err) {
                                alert(err.message);
                            });
                        });
                    });
                };
                Mapper.prototype.showImportDialog = function () {
                    var _this = this;
                    var self = this;
                    var importMappingDialog;
                    var opts = {
                        width: 425,
                        height: 250,
                        cancelText: "Close",
                        okCallback: function (result) {
                            _this.adapter.store.getCollection(self.projectId + "-requirements", function (reqt) {
                                self.getRequirements(reqt);
                            });
                        },
                        title: "Import Requirements",
                        getDialogResult: function () {
                            return importMappingDialog ? importMappingDialog.import() : null;
                        }
                    };
                    VSS.getService(VSS.ServiceIds.Dialog).then(function (dlg) {
                        dlg.openDialog(VSS.getExtensionContext().publisherId + "." + VSS.getExtensionContext().extensionId + ".importDialog", opts).then(function (dialog) {
                            dialog.updateOkButton(true);
                            dialog.getContributionInstance("createImportDialog").then(function (ci) {
                                importMappingDialog = ci;
                                importMappingDialog.start();
                            }, function (err) {
                                alert(err.message);
                            });
                        });
                    });
                };
                Mapper.prototype.showMappingDialog = function (reqt) {
                    var self = this;
                    var createMappingDialog;
                    var opts = {
                        width: 500,
                        height: 400,
                        okText: "Save",
                        cancelText: "Close",
                        okCallback: function (result) {
                            var storage = new Storage.VsoDocumentServiceAdapter("ProjectCollection");
                            var coll;
                            storage.getCollection(VSS.getWebContext().project.id + "-requirements", function (src) {
                                coll = new Common.RequirementCollection(src);
                                var requirement = coll.getItem(reqt);
                                requirement.MappedItems = result;
                                coll.update(requirement);
                                storage.remove(VSS.getWebContext().project.id + "-requirements");
                                storage.setCollection(VSS.getWebContext().project.id + "-requirements", coll.toString());
                                self.messenger.displayMessage(reqt + " successfully mapped to item(s) " + result + ".", CommonControls.MessageAreaType.Info);
                            });
                        },
                        title: "Map Work Item(s): " + reqt,
                        getDialogResult: function () {
                            return createMappingDialog ? createMappingDialog.save() : null;
                        }
                    };
                    VSS.getService(VSS.ServiceIds.Dialog).then(function (dlg) {
                        dlg.openDialog(VSS.getExtensionContext().publisherId + "." + VSS.getExtensionContext().extensionId + ".mappingDialog", opts).then(function (dialog) {
                            dialog.getContributionInstance("createMappingDialog").then(function (ci) {
                                createMappingDialog = ci;
                                createMappingDialog.start("" + reqt);
                            }, function (err) {
                                alert(err.message);
                            });
                            dialog.updateOkButton(true);
                        });
                    });
                };
                Mapper.prototype.clearRequirements = function () {
                    // Get confirmation that someone wants to delete this first?
                    var self = this;
                    var result = confirm("Are you sure you want to delete all requirements?  This will delete any mappings you have created as well.");
                    if (result.valueOf() == true) {
                        self.adapter.store.remove(self.projectId + "-requirements");
                        $("#content").html("");
                        self.getRequirements();
                    }
                };
                return Mapper;
            }(Common.ViewModelBase));
            Core.Mapper = Mapper;
        })(Core = rMapper.Core || (rMapper.Core = {}));
    })(rMapper = exports.rMapper || (exports.rMapper = {}));
    var adapter = new Adapters.flatFileAdapter(new Storage.VsoDocumentServiceAdapter("ProjectCollection"));
    exports.rm = new rMapper.Core.Mapper(adapter);
});
//# sourceMappingURL=mappings.js.map