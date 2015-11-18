//---------------------------------------------------------------------
// <copyright file="gaps.ts">
//    This code is licensed under the MIT License.
//    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF 
//    ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED 
//    TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
//    PARTICULAR PURPOSE AND NONINFRINGEMENT.
// </copyright>
// <summary>Backing model for the gap analysis view.</summary>
//---------------------------------------------------------------------
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "Scripts/common", "Scripts/storage"], function (require, exports, Common, Storage) {
    var rMapper;
    (function (rMapper) {
        var GapAnalysis = (function (_super) {
            __extends(GapAnalysis, _super);
            function GapAnalysis(storageAdapter) {
                _super.call(this);
                this.store = storageAdapter;
                $('#reqTitle').text("Gap Analysis");
                this.setActiveNode($('#reqTitle').text());
            }
            GapAnalysis.prototype.start = function () {
                var self = this;
                self.validateTemplate(function () {
                    self.store.getCollection(self.projectId + "-requirements", function (requirements) {
                        if (requirements != null) {
                            $('#gapContent').show();
                            require(["VSS/Controls", "VSS/Controls/Grids"], function (Controls, Grids) {
                                var grid = Controls.create(Grids.Grid, $('#gapContent'), {
                                    height: "300px",
                                    lastCellFillsRemainingContent: true,
                                    columns: [
                                        { text: "ID", index: "RequirementId", width: 75 },
                                        { text: "Title", index: 'Title', width: 200 },
                                        { text: "Description", index: 'Description', width: 300 },
                                        {
                                            text: "Mapped Work Items",
                                            index: "MappedItems",
                                            width: 300,
                                            getCellContents: function (rowInfo, dataIndex, expandedState, level, column, indentIndex, columnOrder) {
                                                var contents = grid.getColumnValue(dataIndex, column.index);
                                                var cssClass = (contents == null || contents == "None") ? "buildvnext-admin-agent-status-offline" : "buildvnext-admin-agent-status-online";
                                                if (contents) {
                                                }
                                                var indicator = $('<div class="grid-cell"></div>').addClass(cssClass);
                                                var display = $('<div style="margin-left:8px;padding-left:5px;"></div>').append('<span>' + (contents || "") + '</span>');
                                                return $("<div class='grid-cell'></div>")
                                                    .width(column.width || 100)
                                                    .append(indicator).append(display);
                                            }
                                        }
                                    ],
                                    source: JSON.parse(requirements)
                                });
                            });
                        }
                        else {
                            $('#noGapContent').show();
                        }
                    });
                });
            };
            return GapAnalysis;
        })(Common.ViewModelBase);
        rMapper.GapAnalysis = GapAnalysis;
    })(rMapper = exports.rMapper || (exports.rMapper = {}));
    exports.ga = new rMapper.GapAnalysis(new Storage.VsoDocumentServiceAdapter("ProjectCollection"));
});
//# sourceMappingURL=gaps.js.map