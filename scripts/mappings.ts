//---------------------------------------------------------------------
// <copyright file="mappings.ts">
//    This code is licensed under the MIT License.
//    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF 
//    ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED 
//    TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
//    PARTICULAR PURPOSE AND NONINFRINGEMENT.
// </copyright>
// <summary>Backing model for the default extension view, allowing the user to map requirements.</summary>
//---------------------------------------------------------------------
/// <reference path='ref/VSS.d.ts' />
/// <reference path='ref/xlsx.d.ts' />
/// <reference path='adapters.ts' />
import Adapters = require("Scripts/adapters");
import Utilities = require("Scripts/utilities");
import Storage = require("Scripts/storage");
import Common = require("Scripts/common");
import Controls = require("VSS/Controls");
import Menus = require("VSS/Controls/Menus");
import CommonControls = require("VSS/Controls/Notifications");
import Grids = require("VSS/Controls/Grids");

export module rMapper {
    export module Core {


        export class Mapper extends Common.ViewModelBase implements Common.IAppInit {
            adapter: Adapters.IRequirementsSourceAdapter;
            grid: Grids.Grid;
            menu: Menus.MenuBar;

            public constructor(adapter: Adapters.IRequirementsSourceAdapter) {
                var self = this;
                super();
                self.adapter = adapter;
                $('#reqTitle').text("Requirements");
                self.setActiveNode($('#reqTitle').text());
                self.menu = Controls.create<Menus.MenuBar,any>(Menus.MenuBar, $('#reqtMenu'), {
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
                    executeAction: (args) => {
                        var command = args.get_commandName();
                        switch(command) {
                            case "clearButton":
                                self.clearRequirements();
                                break;
                            case "importButton":
                                self.showImportDialog();
                                break;
                            case "exportButton":
                                this.adapter.store.getCollection(self.projectId + "-requirements", (reqt) => {
                                    Utilities.exportToExcel(reqt, { bookType: 'xlsx', bookSST: true, type: 'binary' });
                                });
                                break;
                        }
                    }
                });
            }

            start() {
                var self = this;
                
                // Initial query/load of data
                setTimeout(() => {
                    self.validateTemplate(() => {
                        this.adapter.store.getCollection(self.projectId + "-requirements", (reqt) => {
                            self.getRequirements(reqt);
                        });

                    });
                }, 750);

            }

            getRequirements(reqt?: any) {
                var self = this;
                var importItem = self.menu.getItem("importButton");
                var exportItem = self.menu.getItem("exportButton");
                var clearItem = self.menu.getItem("clearButton");

                function menuItemClick(args) {
                    // Get the item associated with the context menu
                    var reqt = args.get_commandArgument().item;
                    switch (args.get_commandName()) {
                        case "map":
                            self.showMappingDialog((<Common.Requirement>reqt).RequirementId);
                            break;
                        case "visualize":
                            self.showVisualizationDialog(<Common.Requirement>reqt);
                            break;
                    }
                }

                function getContextMenuItems(): Menus.IMenuItemSpec[] {
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
                    require(["VSS/Controls", "VSS/Controls/Grids"], (Controls, Grids) => {
                        self.grid = Controls.create(Grids.Grid, $("#content"), {
                            height: "300px",
                            gutter: {
                                contextMenu: true
                            },
                            contextMenu: {
                                items: getContextMenuItems(),
                                executeAction: menuItemClick,
                                arguments: (contextInfo) => {
                                    return { item: contextInfo.item };
                                }
                            },
                            columns: [
                                { text: "ID", index: "RequirementId", width: 75 },
                                { text: "Title", index: "Title", width: 200 },
                                { text: "Description", index: "Description", width: 500 },
                            ],
                            openRowDetail: (index: number) => {
                                var req: Common.Requirement = self.grid.getRowData(index);
                                self.showMappingDialog(req.RequirementId);
                            },
                            source: JSON.parse(reqt)
                        });
                    });
                    $("#content").show();
                    self.menu.updateCommandStates([
                        { id: "importButton", disabled: !(importItem.getCommandState() & Menus.MenuItemState.Disabled)  },
                        { id: "exportButton", disabled: !(exportItem.getCommandState() & Menus.MenuItemState.Disabled)  },
                        { id: "clearButton", disabled: !(clearItem.getCommandState() & Menus.MenuItemState.Disabled)  }
                    ]);
                    setTimeout(() => {
                        $("a.mapButton").on("click", (e) => {
                            e.preventDefault();
                            self.showMappingDialog($(e.currentTarget).attr("req"));
                        });
                    }, 500);
                } else {
                    self.menu.updateCommandStates([
                        { id: "importButton", disabled: !(importItem.getCommandState() & Menus.MenuItemState.Disabled)  },
                        { id: "exportButton", disabled: !(exportItem.getCommandState() & Menus.MenuItemState.Disabled)  },
                        { id: "clearButton", disabled: !(clearItem.getCommandState() & Menus.MenuItemState.Disabled)  }
                    ]);
                    self.messenger.displayMessage("It appears you do not have any requirements.  Please use the Import button to add requirements.", CommonControls.MessageAreaType.Info);
                }
            }

            showVisualizationDialog(req: Common.Requirement) {
                var self = this;
                var createVizDialog;

                var opts: IHostDialogOptions = {
                    width: 800,
                    height: 600,
                    buttons: null,
                    title: `Visualize Requirement: ` + req.RequirementId
                };


                VSS.getService(VSS.ServiceIds.Dialog).then((dlg: IHostDialogService) => {
                    dlg.openDialog(VSS.getExtensionContext().publisherId + "." + VSS.getExtensionContext().extensionId + ".visualizerDialog", opts).then((dialog) => {
                        dialog.getContributionInstance("createVisualizerDialog").then((ci: any) => {
                            createVizDialog = ci;
                            createVizDialog.start(req);
                        }, (err) => {
                            alert(err.message);

                        });
                        

                    });

                });
            }

            showImportDialog() {
                var self = this;
                var importMappingDialog; 
                var opts: IHostDialogOptions = {
                    width: 425,
                    height: 250,
                    cancelText: "Close",
                    okCallback: (result) => {
                        
                        this.adapter.store.getCollection(self.projectId + "-requirements", (reqt) => {
                            self.getRequirements(reqt);
                        });

                    },
                    title: `Import Requirements`,
                    getDialogResult: () => {
                        return importMappingDialog ? importMappingDialog.import() : null;
                    }
                };


                VSS.getService(VSS.ServiceIds.Dialog).then((dlg: IHostDialogService) => {
                    dlg.openDialog(VSS.getExtensionContext().publisherId + "." + VSS.getExtensionContext().extensionId + ".importDialog", opts).then((dialog) => {
                        dialog.updateOkButton(true);
                        dialog.getContributionInstance("createImportDialog").then((ci: any) => {
                            importMappingDialog = ci;
                            importMappingDialog.start();
                        }, (err) => {
                            alert(err.message);

                        });

                    });

                });
            }

            showMappingDialog(reqt: string) {
                var self = this;
                var createMappingDialog;

                var opts: IHostDialogOptions = {
                    width: 500,
                    height: 400,
                    okText: "Save",
                    cancelText: "Close",
                    okCallback: (result) => {
                        var storage = new Storage.VsoDocumentServiceAdapter("ProjectCollection");
                        var coll: Common.RequirementCollection;

                        storage.getCollection(VSS.getWebContext().project.id + "-requirements", (src) => {
                            coll = new Common.RequirementCollection(src);
                            var requirement: Common.Requirement = coll.getItem(reqt);
                            requirement.MappedItems = result;
                            coll.update(requirement);
                            storage.remove(VSS.getWebContext().project.id + "-requirements");
                            storage.setCollection(VSS.getWebContext().project.id + "-requirements", coll.toString());
                            self.messenger.displayMessage(reqt + " successfully mapped to item(s) " + result + ".", CommonControls.MessageAreaType.Info);
                        });
                    },
                    title: `Map Work Item(s): ${reqt}`,
                    getDialogResult: () => {
                        return createMappingDialog ? createMappingDialog.save() : null;
                    }
                };


                VSS.getService(VSS.ServiceIds.Dialog).then((dlg: IHostDialogService) => {
                    dlg.openDialog(VSS.getExtensionContext().publisherId + "." + VSS.getExtensionContext().extensionId + ".mappingDialog", opts).then((dialog) => {
                        dialog.getContributionInstance("createMappingDialog").then((ci: any) => {
                            createMappingDialog = ci;
                            createMappingDialog.start(`${reqt}`);
                        }, (err) => {
                            alert(err.message);

                        });
                        dialog.updateOkButton(true);

                    });

                });

            }

            clearRequirements() {
                // Get confirmation that someone wants to delete this first?
                var self = this;
                var result = confirm("Are you sure you want to delete all requirements?  This will delete any mappings you have created as well.");
                if (result.valueOf() == true) {
                    self.adapter.store.remove(self.projectId + "-requirements");
                    $("#content").html("");
                    self.getRequirements();
                }
                
            }
        }


    }
}

var adapter = new Adapters.flatFileAdapter(new Storage.VsoDocumentServiceAdapter("ProjectCollection"));
exports.rm = new rMapper.Core.Mapper(adapter);
