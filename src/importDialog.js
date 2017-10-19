//---------------------------------------------------------------------
// <copyright file="importDialog.ts">
//    This code is licensed under the MIT License.
//    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF 
//    ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED 
//    TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
//    PARTICULAR PURPOSE AND NONINFRINGEMENT.
// </copyright>
// <summary>Backing model for the requirements import dialog view.</summary>
//---------------------------------------------------------------------
let __extends = (this && this.__extends) || function (d, b) {
    for (let p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "Scripts/storage", "Scripts/services", "VSS/Controls/Dialogs", "Scripts/adapters"], function (require, exports, Storage, Services, Dialogs, Adapters) {
    "use strict";
    let ImportDialog = (function (_super) {
        __extends(ImportDialog, _super);
        function ImportDialog(context) {
            _super.call(this);
            let self = this;
            self.context = context;
            self.messenger = new Services.messageService();
            self.adapter = new Adapters.flatFileAdapter(new Storage.VsoDocumentServiceAdapter("ProjectCollection"));
        }
        ImportDialog.prototype.start = function () {
            let self = this;
            $("#myFile").on("change", function () {
                self.adapter.process($("#myFile")[0], null);
                self.updateOkButton(true);
            });
        };
        ImportDialog.prototype.import = function () {
            let self = this;
            return true;
            //self.updateOkButton(true);
        };
        return ImportDialog;
    }(Dialogs.ModalDialog));
    exports.ImportDialog = ImportDialog;
    exports.dlg = new ImportDialog();
});
//# sourceMappingURL=importDialog.js.map