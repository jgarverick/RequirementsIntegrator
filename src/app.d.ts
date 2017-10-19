/// <reference path="ref/VSS.d.ts" />
/// <reference path="ref/xlsx.d.ts" />
/// <reference path="adapters.d.ts" />
import Adapters = require("Scripts/adapters");
import Common = require("Scripts/common");
export declare module rMapper {
    module Core {
        class Mapper implements Common.IAppInit {
            adapter: Adapters.IRequirementsSourceAdapter;
            processTemplate: string;
            private projectId;
            constructor(adapter: Adapters.IRequirementsSourceAdapter);
            start(): void;
            getRequirements(reqt?: any): void;
            showMappingDialog(reqt: string): void;
            clearRequirements(): void;
        }
    }
}
