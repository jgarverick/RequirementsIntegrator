// ---------------------------------------------------------------------
// <copyright file="sprints.ts">
//    This code is licensed under the MIT License.
//    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF
//    ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
//    TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
//    PARTICULAR PURPOSE AND NONINFRINGEMENT.
// </copyright>
// <summary>Backing model for the Sprint report view.</summary>
// ---------------------------------------------------------------------
import Storage = require("../src/storage");
import Common = require("../src/common");
import Services = require("../src/services");
import CommonControls = require("VSS/Controls/Notifications");

export namespace rMapper {
    export interface IterationItem {
        name: string;
        children: Array<Common.Requirement>;
    }

    export class SprintView extends Common.ViewModelBase implements Common.IStorageInit {
        store: Storage.IStorageProvider;
        requirements: Array<Common.Requirement>;

        public constructor(public storageAdapter: Storage.IStorageProvider) {
            super();
            this.store = storageAdapter;
            $("#reqTitle").text("Iteration Path View");
            this.setActiveNode($("#reqTitle").text());
        }

        start() {
            let self = this;
            setTimeout(() => {
                self.validateTemplate(() => {
                    self.store.getCollection(self.projectId + "-requirements", (results) => {
                        self.requirements = JSON.parse(results);
                        self.getSprints();
                    });
                });
            }, 500);
        }

        getSprints() {
            let self = this;
            let qs = new Services.QueryService();
            qs.getWorkItems("select * from WorkItems where [System.TeamProject] = '${VSS.getWebContext().project.name}'",
            ["System.IterationPath"]).then((results) => {
                let headers = new Array<IterationItem>();
                results.forEach((item, index) => {
                    if (headers.filter((f) => { return f.name === item.fields["System.IterationPath"]; }).length < 1) {

                        let items = results.filter((x) => { return x.fields["System.IterationPath"] === item.fields["System.IterationPath"]; });
                        // Now grab the work items that are also in the requirements collection
                        let reqs: Array<Common.Requirement> = new Array<Common.Requirement>();
                        items.forEach((itm, idx) => {
                            self.requirements.forEach((r, i) => {
                                if (r.MappedItems && r.MappedItems.split(",").indexOf(itm.id.toString()) >= 0) {
                                    if (reqs.filter((f) => { return f.RequirementId === r.RequirementId; }).length < 1) {
                                        reqs.push(r);
                                    }
                                }
                            });
                        });
                        let iitem: IterationItem = {
                            name: item.fields["System.IterationPath"].toString(),
                            children: reqs
                        };
                        headers.push(iitem);
                    }
                });
                // $('#content').html(JSON.stringify(headers));

                require(["VSS/Controls", "VSS/Controls/Grids"], (Controls, Grids) => {
                    let grid = Controls.create(Grids.Grid, $("#content"), {
                        height: "300px",
                        lastCellFillsRemainingContent: true,
                        columns: [
                            { text: "Iteration Path", index: "name", width: 200, indent: true },
                            { text: "Requirement", index: "RequirementId", width: 100 },
                            { text: "Title", index: "Title", width: 275, indent: true }
                        ]
                    });
                    grid.setDataSource(new Grids.GridHierarchySource(headers));
                });
            }, (e) => {
                self.messenger.displayMessage(e.message, CommonControls.MessageAreaType.Error);
            });
        }

    }

}

exports.sv = new rMapper.SprintView(new Storage.VsoDocumentServiceAdapter("ProjectCollection"));