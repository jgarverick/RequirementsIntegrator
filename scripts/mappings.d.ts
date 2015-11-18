/// <reference path="ref/VSS.d.ts" />
/// <reference path="ref/xlsx.d.ts" />
/// <reference path="adapters.d.ts" />
import Adapters = require("Scripts/adapters");
import Common = require("Scripts/common");
import Menus = require("VSS/Controls/Menus");
import Grids = require("VSS/Controls/Grids");
export declare module rMapper {
    module Core {
        class Mapper extends Common.ViewModelBase implements Common.IAppInit {
            adapter: Adapters.IRequirementsSourceAdapter;
            grid: Grids.Grid;
            menu: Menus.MenuBar;
            constructor(adapter: Adapters.IRequirementsSourceAdapter);
            start(): void;
            getRequirements(reqt?: any): void;
            showVisualizationDialog(req: Common.Requirement): void;
            showImportDialog(): void;
            showMappingDialog(reqt: string): void;
            clearRequirements(): void;
        }
    }
}
