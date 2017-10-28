// ---------------------------------------------------------------------
// <copyright file="importDialog.ts">
//    This code is licensed under the MIT License.
//    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF
//    ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
//    TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
//    PARTICULAR PURPOSE AND NONINFRINGEMENT.
// </copyright>
// <summary>Backing model for the requirements import dialog view.</summary>
// ---------------------------------------------------------------------

/// <reference path="ref/xlsx.d.ts" />
/// <reference path="adapters.ts" />

import Storage = require("storage");
import Controls = require("VSS/Controls");
import Grids = require("VSS/Controls/Grids");
import Services = require("services");
import Dialogs = require("VSS/Controls/Dialogs");
import Adapters = require("adapters");
import Common = require("common");

export class ImportDialog extends Dialogs.ModalDialog {
    messenger: Services.MessageService;
    adapter: Adapters.IRequirementsSourceAdapter;
    context: WebContext;

    constructor(context?: WebContext) {
        super();
        let self = this;
        self.context = context;
        self.messenger = new Services.MessageService();
        self.adapter = new Adapters.FlatFileAdapter(new Storage.VsoDocumentServiceAdapter("ProjectCollection"));
    }

    start() {
        let self = this;

        $("#myFile").on("change", () => {
            self.adapter.process($("#myFile")[0], null);
            self.updateOkButton(true);
        });
    }

    import() {
        let self = this;
        return true;
        // self.updateOkButton(true);
    }
}

exports.dlg = new ImportDialog();