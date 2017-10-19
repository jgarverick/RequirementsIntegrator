/// <reference path="ref/VSS.d.ts" />
/// <reference path="ref/xlsx.d.ts" />
/// <reference path="adapters.d.ts" />
import Services = require("Scripts/services");
import Dialogs = require("VSS/Controls/Dialogs");
import Adapters = require("Scripts/adapters");
export declare class ImportDialog extends Dialogs.ModalDialog {
    messenger: Services.messageService;
    adapter: Adapters.IRequirementsSourceAdapter;
    context: WebContext;
    constructor(context?: WebContext);
    start(): void;
    import(): boolean;
}
