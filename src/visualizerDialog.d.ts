/// <reference path="ref/VSS.d.ts" />
/// <reference path="ref/xlsx.d.ts" />
/// <reference path="adapters.d.ts" />
import Services = require("src/services");
import Dialogs = require("VSS/Controls/Dialogs");
import Adapters = require("src/adapters");
import Common = require("src/common");
export declare class VisualizerDialog extends Dialogs.ModalDialog {
    messenger: Services.MessageService;
    adapter: Adapters.IRequirementsSourceAdapter;
    context: WebContext;
    cytoscape: any;
    mappedItems: Array<string>;
    constructor(context?: WebContext, cy?: any);
    start(item: Common.Requirement): boolean;
    visualize(): void;
    createHierarchy(data: any): void;
}
