var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "src/storage", "src/common", "src/services", "VSS/Controls/Notifications"], function (require, exports, Storage, Common, Services, CommonControls) {
    "use strict";
    var rMapper;
    (function (rMapper) {
        var SprintView = (function (_super) {
            __extends(SprintView, _super);
            function SprintView(storageAdapter) {
                _super.call(this);
                this.storageAdapter = storageAdapter;
                this.store = storageAdapter;
                $('#reqTitle').text("Iteration Path View");
                this.setActiveNode($('#reqTitle').text());
            }
            SprintView.prototype.start = function () {
                var self = this;
                setTimeout(function () {
                    self.validateTemplate(function () {
                        self.store.getCollection(self.projectId + "-requirements", function (results) {
                            self.requirements = JSON.parse(results);
                            self.getSprints();
                        });
                    });
                }, 500);
            };
            SprintView.prototype.getSprints = function () {
                var self = this;
                var qs = new Services.QueryService();
                qs.getWorkItems("select * from WorkItems where [System.TeamProject] = '" + VSS.getWebContext().project.name + "'", ["System.IterationPath"]).then(function (results) {
                    var headers = new Array();
                    results.forEach(function (item, index) {
                        if (headers.filter(function (f) { return f.name == item.fields["System.IterationPath"]; }).length < 1) {
                            var items = results.filter(function (x) { return x.fields["System.IterationPath"] == item.fields["System.IterationPath"]; });
                            // Now grab the work items that are also in the requirements collection
                            var reqs = new Array();
                            items.forEach(function (itm, idx) {
                                self.requirements.forEach(function (r, i) {
                                    if (r.MappedItems && r.MappedItems.split(",").indexOf(itm.id.toString()) >= 0) {
                                        if (reqs.filter(function (f) { return f.RequirementId == r.RequirementId; }).length < 1) {
                                            reqs.push(r);
                                        }
                                    }
                                });
                            });
                            var iitem = {
                                name: item.fields["System.IterationPath"].toString(),
                                children: reqs
                            };
                            headers.push(iitem);
                        }
                    });
                    //$('#content').html(JSON.stringify(headers));
                    require(["VSS/Controls", "VSS/Controls/Grids"], function (Controls, Grids) {
                        var grid = Controls.create(Grids.Grid, $('#content'), {
                            height: "300px",
                            lastCellFillsRemainingContent: true,
                            columns: [
                                { text: "Iteration Path", index: "name", width: 200, indent: true },
                                { text: "Requirement", index: 'RequirementId', width: 100 },
                                { text: "Title", index: 'Title', width: 275, indent: true }
                            ]
                        });
                        grid.setDataSource(new Grids.GridHierarchySource(headers));
                    });
                }, function (e) {
                    self.messenger.displayMessage(e.message, CommonControls.MessageAreaType.Error);
                });
            };
            return SprintView;
        }(Common.ViewModelBase));
        rMapper.SprintView = SprintView;
    })(rMapper = exports.rMapper || (exports.rMapper = {}));
    exports.sv = new rMapper.SprintView(new Storage.VsoDocumentServiceAdapter("ProjectCollection"));
});
//# sourceMappingURL=sprints.js.map