﻿// ---------------------------------------------------------------------
// <copyright file="utilities.ts">
//    This code is licensed under the MIT License.
//    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF
//    ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
//    TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
//    PARTICULAR PURPOSE AND NONINFRINGEMENT.
// </copyright>
// <summary>Utility methods for boundary logging, process template information and others.</summary>
// ---------------------------------------------------------------------

import Services = require("services");
import CommonControls = require("VSS/Controls/Notifications");
import Projects = require("TFS/Core/RestClient");
import VSS_Service = require("VSS/Service");
import VSS_Contracts = require("TFS/Core/Contracts");
import Common = require("common");

let messenger = new Services.MessageService();
let datenum, encode_range;

export function executeBoundary(target: Function) {
    try {
        target();
    } catch (e) {
        messenger.displayMessage(e, CommonControls.MessageAreaType.Error);
    }
}

export function getProcessTemplate(projectName: string): IPromise<VSS_Contracts.TeamProject> {
    let client = VSS_Service.getCollectionClient(Projects.CoreHttpClient);
    return client.getProject(projectName, true);
}

export function exportToExcel(jsonObject, opts) {
    let ws = {};
    // Convert objects to two dimensional array
    let data: Array<Array<any>> = new Array<Array<any>>();
    let reqts = <Array<Common.Requirement>>JSON.parse(jsonObject);
    data[0] = ["RequirementId", "Title", "Description", "MappedItems"];
    reqts.forEach((itm, idx) => {
        data[idx + 1] = [itm.RequirementId, itm.Title, itm.Description, itm.MappedItems];
    });
    // format the 2D array as worksheet cells
    let range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 } };
    require(["dist/FileSaver"], (saveAs) => {
        for (let R = 0; R !== data.length; ++R) {
            for (let C = 0; C !== data[R].toString().length; ++C) {
                if (range.s.r > R) { range.s.r = R; }
                if (range.s.c > C) { range.s.c = C; }
                if (range.e.r < R) { range.e.r = R; }
                if (range.e.c < C) { range.e.c = C; }
                let cell: XLSX.IWorkSheetCell = { v: data[R][C], t: "s" };
                if (cell.v == null) { continue; }
                let cell_ref = XLSX.utils.encode_cell({ c: C, r: R });

                if (typeof cell.v === "number") { cell.t = "n"; }
                else if (typeof cell.v === "boolean") { cell.t = "b"; }
                else if (<any>cell.v instanceof Date) {
                    cell.t = "n";
                    cell.z = XLSX.SSF._table[14];
                    cell.v = datenum(cell.v);
                } else { cell.t = "s"; }

                ws[cell_ref] = cell;
            }
        }
        if (range.s.c < 10000000) { ws["!ref"] = XLSX.utils.encode_range(range); }
        /* bookType can be "xlsx" or "xlsm" or "xlsb" */
        let workbook: any = {
            SheetNames: [],
            Sheets: {}
        };
        workbook.SheetNames.push("Requirements");
        workbook.Sheets["Requirements"] = ws;
        let wbout = XLSX.write(workbook, opts);

        function s2ab(s) {
            let buf = new ArrayBuffer(s.length);
            let view = new Uint8Array(buf);
            for (let i = 0; i !== s.length; ++i) { view[i] = s.charCodeAt(i) & 0xFF; }
            return buf;
        }

        /* the saveAs call downloads a file on the local machine */
        return saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), VSS.getWebContext().project.name + ".xlsx");

    });

}