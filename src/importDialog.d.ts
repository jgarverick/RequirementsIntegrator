/// <reference path="ref/VSS.d.ts" />
/// <reference path="ref/xlsx.d.ts" />
/// <reference path="adapters.d.ts" />
import Services = require("src/services");
import Dialogs = require("VSS/Controls/Dialogs");
import Adapters = require("src/adapters");
export declare class ImportDialog extends Dialogs.ModalDialog {
    messenger: Services.MessageService;
    adapter: Adapters.IRequirementsSourceAdapter;
    context: WebContext;
    constructor(context?: WebContext);
    start(): void;
    import(): boolean;
}
