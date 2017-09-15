//---------------------------------------------------------------------
// <copyright file="adapters.ts">
//    This code is licensed under the MIT License.
//    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF 
//    ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED 
//    TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
//    PARTICULAR PURPOSE AND NONINFRINGEMENT.
// </copyright>
// <summary>A collection of interfaces and classes used to define requirements
// data sources.
// </summary>
//---------------------------------------------------------------------
/// <reference path='services.ts' />
define(["require", "exports", "Scripts/services", "Scripts/storage", "VSS/Controls/Notifications", "Scripts/common"], function (require, exports, Services, Storage, CommonControls, Common) {
    "use strict";
    var flatFileAdapter = (function () {
        function flatFileAdapter(dataStore) {
            this.store = dataStore == null ? new Storage.LocalStorageAdapter() : dataStore;
            this.msg = new Services.messageService();
            this.projectId = VSS.getWebContext().project.id;
        }
        flatFileAdapter.prototype.process = function (e, callback) {
            var self = this;
            var files = e.files;
            var i, f;
            f = files[0];
            var reader = new FileReader();
            var name = f.name;
            reader.onload = function (e) {
                var data = e.target.result;
                try {
                    var workbook = XLSX.read(data, { type: 'binary' });
                    /* DO SOMETHING WITH workbook HERE */
                    var sheetNameList = workbook.SheetNames;
                    sheetNameList.forEach(function (y) {
                        var worksheet = workbook.Sheets[y];
                        var src = XLSX.utils.sheet_to_json(worksheet);
                        var collection = new Common.RequirementCollection(JSON.stringify(src));
                        self.store.setCollection(self.projectId + "-requirements", collection.toString());
                        if (callback)
                            callback();
                    });
                }
                catch (ex) {
                    self.msg.displayMessage(ex.message, CommonControls.MessageAreaType.Error);
                }
            };
            reader.readAsBinaryString(f);
        };
        return flatFileAdapter;
    }());
    exports.flatFileAdapter = flatFileAdapter;
    var repositoryAdapter = (function () {
        function repositoryAdapter() {
        }
        repositoryAdapter.prototype.process = function (e) { };
        return repositoryAdapter;
    }());
    exports.repositoryAdapter = repositoryAdapter;
});
//# sourceMappingURL=adapters.js.map