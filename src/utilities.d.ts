import VSS_Contracts = require("TFS/Core/Contracts");
export declare function executeBoundary(target: Function): void;
export declare function getProcessTemplate(projectName: string): IPromise<VSS_Contracts.TeamProject>;
export declare function exportToExcel(jsonObject: any, opts: any): void;
