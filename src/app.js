define(["require", "exports", "Scripts/services", "VSS/Controls/Common", "Scripts/adapters", "Scripts/storage", "Scripts/utilities"], function (require, exports, Services, CommonControls, Adapters, Storage, Utilities) {
    var messenger = new Services.messageService();
    var rMapper;
    (function (rMapper) {
        var Core;
        (function (Core) {
            var Mapper = (function () {
                function Mapper(adapter) {
                    this.adapter = adapter;
                    var self = this;
                    self.projectId = VSS.getWebContext().project.id;
                    Utilities.getProcessTemplate(self.projectId).then(function (result) {
                        self.processTemplate = result.capabilities["processTemplate"]["templateName"];
                    }, function (e) {
                        messenger.displayMessage(e.message, CommonControls.MessageAreaType.Error);
                    });
                }
                Mapper.prototype.start = function () {
                    var self = this;
                    $("#myFile").on("change", function () {
                        self.adapter.process($("#myFile")[0], self.getRequirements);
                    });
                    $("#clearButton").on("click", function (e) {
                        e.preventDefault();
                        self.clearRequirements();
                        $("#loader").show();
                        $("#content").hide();
                    });
                    // Initial query/load of data
                    this.adapter.store.getCollection(self.projectId + "-requirements", function (reqt) {
                        if (self.processTemplate.match("CMMI") != null) {
                            $("#loader").hide();
                            $("#clearButton").hide();
                            $("#content").show().append("<h4>The CMMI process template allows you to manage requirements natively.  Import functionality has been disabled at this time.</h4>");
                            messenger.displayMessage("Warning: CMMI process template detected.", CommonControls.MessageAreaType.Warning);
                        }
                        else {
                            self.getRequirements(reqt);
                        }
                    });
                };
                Mapper.prototype.getRequirements = function (reqt) {
                    var self = this;
                    if (reqt != null) {
                        $("#loader").hide();
                        $("#content").html("");
                        require(["VSS/Controls", "VSS/Controls/Grids"], function (Controls, Grids) {
                            var grid = Controls.create(Grids.Grid, $("#content"), {
                                height: "300px",
                                columns: [
                                    {
                                        text: "Map",
                                        width: 65,
                                        index: "",
                                        getCellContents: function (rowInfo, dataIndex, expandedState, level, column, indentIndex, columnOrder) {
                                            var contents = "";
                                            try {
                                                contents = grid.getColumnValue(dataIndex, "RequirementId");
                                            }
                                            catch (e) {
                                            }
                                            return $("<div class='grid-cell total'/>")
                                                .width(column.width || 100)
                                                .append($("<a req='" + contents + "' class='mapButton'>Map</a>"));
                                        }
                                    },
                                    { text: "ID", index: "RequirementId", width: 75 },
                                    { text: "Summary", index: "Summary", width: 200 },
                                    { text: "Description", index: "Description", width: 300 }
                                ],
                                source: JSON.parse(reqt)
                            });
                        });
                        $("#content").show();
                        setTimeout(function () {
                            $("a.mapButton").on("click", function (e) {
                                e.preventDefault();
                                self.showMappingDialog($(e.currentTarget).attr("req"));
                            });
                        }, 500);
                    }
                    else {
                        $("#loader").show();
                    }
                };
                Mapper.prototype.showMappingDialog = function (reqt) {
                    var self = this;
                    var createMappingDialog;
                    var opts = {
                        width: 600,
                        height: 475,
                        okText: "Save",
                        okCallback: function (result) {
                            createMappingDialog.close();
                        },
                        title: "Work Item Mapping: " + reqt,
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
                    this.adapter.store.remove(self.projectId + "-requirements");
                };
                return Mapper;
            })();
            Core.Mapper = Mapper;
        })(Core = rMapper.Core || (rMapper.Core = {}));
    })(rMapper = exports.rMapper || (exports.rMapper = {}));
    var adapter = new Adapters.flatFileAdapter(new Storage.VsoDocumentServiceAdapter("ProjectCollection"));
    exports.rm = new rMapper.Core.Mapper(adapter);
});
//# sourceMappingURL=app.js.map