/// <reference path="ref/VSS.d.ts" />
import Services = require("Scripts/services");
import Dialogs = require("VSS/Controls/Dialogs");
import Adapters = require("Scripts/adapters");
export declare class MappingDialog extends Dialogs.ModalDialog {
    messenger: Services.messageService;
    adapter: Adapters.IRequirementsSourceAdapter;
    context: WebContext;
    requirementId: string;
    constructor(context?: WebContext);
    getItems(e: any): void;
    start(id: string): void;
    save(): string;
}
