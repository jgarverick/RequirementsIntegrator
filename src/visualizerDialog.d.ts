/// <reference path="ref/VSS.d.ts" />
/// <reference path="ref/xlsx.d.ts" />
/// <reference path="adapters.d.ts" />
import Services = require("Scripts/services");
import Dialogs = require("VSS/Controls/Dialogs");
import Adapters = require("Scripts/adapters");
import Common = require("Scripts/common");
export declare class VisualizerDialog extends Dialogs.ModalDialog {
    messenger: Services.messageService;
    adapter: Adapters.IRequirementsSourceAdapter;
    context: WebContext;
    cytoscape: any;
    mappedItems: Array<string>;
    constructor(context?: WebContext, cy?: any);
    start(item: Common.Requirement): boolean;
    visualize(): void;
    createHierarchy(data: any): void;
}
