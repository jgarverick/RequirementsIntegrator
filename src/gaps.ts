 // ---------------------------------------------------------------------
 // <copyright file="gaps.ts">
 //    This code is licensed under the MIT License.
 //    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF
 //    ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
 //    TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 //    PARTICULAR PURPOSE AND NONINFRINGEMENT.
 // </copyright>
 // <summary>Backing model for the gap analysis view.</summary>
 // ---------------------------------------------------------------------

import Common = require("common");
import Storage = require("storage");

export namespace rMapper {
    export class GapAnalysis extends Common.ViewModelBase implements Common.IStorageInit {
        public store: Storage.IStorageProvider;

        public constructor(storageAdapter: Storage.IStorageProvider) {
            super();
            this.store = storageAdapter;
            $("#reqTitle").text("Gap Analysis");
            this.setActiveNode($("#reqTitle").text());
        }

        public start() {
            let self = this;
            self.validateTemplate(() => {
                self.store.getCollection(self.projectId + "-requirements", (requirements) => {
                if (requirements != null) {
                    $("#gapContent").show();
                    require(["VSS/Controls", "VSS/Controls/Grids"], (Controls, Grids) => {
                        let grid = Controls.create(Grids.Grid, $("#gapContent"), {
                            height: "300px",
                            lastCellFillsRemainingContent: true,
                            columns: [
                                { text: "ID", index: "RequirementId", width: 75 },
                                { text: "Title", index: "Title", width: 200 },
                                { text: "Description", index: "Description", width: 300 },
                                {
                                    text: "Mapped Work Items",
                                    index: "MappedItems",
                                    width: 300,
                                    getCellContents: (rowInfo, dataIndex, expandedState, level, column, indentIndex, columnOrder) => {
                                        let contents = grid.getColumnValue(dataIndex, column.index);
                                        let cssClass = (contents == null || contents === "None") ? "buildvnext-admin-agent-status-offline" : "buildvnext-admin-agent-status-online";
                                        if (contents) {
                                            // TODO: Add link generation here
                                        }
                                        let indicator = $("<div class=\"grid-cell\"></div>").addClass(cssClass);
                                        let display = $("<div style=\"margin-left:8px;padding-left:5px;\"></div>").append("<span>" + (contents || "") + "</span>");
                                        return $("<div class='grid-cell'></div>")
                                            .width(column.width || 100)
                                            .append(indicator).append(display);

                                    }
                                }
                            ],
                            source: JSON.parse(requirements)

                        });
                    });
                } else {
                    $("#noGapContent").show();
                }
            });
            });
        }
    }
}

exports.ga = new rMapper.GapAnalysis(new Storage.VsoDocumentServiceAdapter("ProjectCollection"));