/// <reference path="ref/xlsx.d.ts" />
/// <reference path="model/requirement.d.ts" />
/// <reference path="app.d.ts" />
export declare module rMapper.Adapters {
    interface HTMLFileElement extends HTMLElement {
        files: FileList;
    }
    interface IRequirementsSourceAdapter {
        process(e: any): any;
    }
    class flatFileAdapter implements IRequirementsSourceAdapter {
        constructor();
        process(e: HTMLFileElement): void;
    }
}
