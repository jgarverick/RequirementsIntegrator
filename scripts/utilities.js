//---------------------------------------------------------------------
// <copyright file="utilities.ts">
//    This code is licensed under the MIT License.
//    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF 
//    ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED 
//    TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
//    PARTICULAR PURPOSE AND NONINFRINGEMENT.
// </copyright>
// <summary>Utility methods for boundary logging, process template information and others.</summary>
//---------------------------------------------------------------------
define(["require", "exports", "Scripts/services", "VSS/Controls/Notifications", "TFS/Core/RestClient", "VSS/Service"], function (require, exports, Services, CommonControls, Projects, VSS_Service) {
    var messenger = new Services.messageService();
    var datenum, encode_range;
    function executeBoundary(target) {
        try {
            target();
        }
        catch (e) {
            messenger.displayMessage(e, CommonControls.MessageAreaType.Error);
        }
    }
    exports.executeBoundary = executeBoundary;
    function getProcessTemplate(projectName) {
        var client = VSS_Service.getCollectionClient(Projects.CoreHttpClient);
        return client.getProject(projectName, true);
    }
    exports.getProcessTemplate = getProcessTemplate;
    function exportToExcel(jsonObject, opts) {
        var ws = {};
        // Convert objects to two dimensional array
        var data = new Array();
        var reqts = JSON.parse(jsonObject);
        data[0] = ["RequirementId", "Title", "Description", "MappedItems"];
        reqts.forEach(function (itm, idx) {
            data[idx + 1] = [itm.RequirementId, itm.Title, itm.Description, itm.MappedItems];
        });
        // format the 2D array as worksheet cells
        var range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 } };
        require(["Scripts/dist/FileSaver"], function (saveAs) {
            for (var R = 0; R != data.length; ++R) {
                for (var C = 0; C != data[R].toString().length; ++C) {
                    if (range.s.r > R)
                        range.s.r = R;
                    if (range.s.c > C)
                        range.s.c = C;
                    if (range.e.r < R)
                        range.e.r = R;
                    if (range.e.c < C)
                        range.e.c = C;
                    var cell = { v: data[R][C], t: 's' };
                    if (cell.v == null)
                        continue;
                    var cell_ref = XLSX.utils.encode_cell({ c: C, r: R });
                    if (typeof cell.v === 'number')
                        cell.t = 'n';
                    else if (typeof cell.v === 'boolean')
                        cell.t = 'b';
                    else if (cell.v instanceof Date) {
                        cell.t = 'n';
                        cell.z = XLSX.SSF._table[14];
                        cell.v = datenum(cell.v);
                    }
                    else
                        cell.t = 's';
                    ws[cell_ref] = cell;
                }
            }
            if (range.s.c < 10000000)
                ws['!ref'] = XLSX.utils.encode_range(range);
            /* bookType can be 'xlsx' or 'xlsm' or 'xlsb' */
            var workbook = {
                SheetNames: [],
                Sheets: {}
            };
            workbook.SheetNames.push("Requirements");
            workbook.Sheets["Requirements"] = ws;
            var wbout = XLSX.write(workbook, opts);
            function s2ab(s) {
                var buf = new ArrayBuffer(s.length);
                var view = new Uint8Array(buf);
                for (var i = 0; i != s.length; ++i)
                    view[i] = s.charCodeAt(i) & 0xFF;
                return buf;
            }
            /* the saveAs call downloads a file on the local machine */
            return saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), VSS.getWebContext().project.name + ".xlsx");
        });
    }
    exports.exportToExcel = exportToExcel;
});
//# sourceMappingURL=utilities.js.map