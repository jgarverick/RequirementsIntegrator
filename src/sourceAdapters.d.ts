/// <reference path="ref/xlsx.d.ts" />
/// <reference path="model/requirement.d.ts" />
/// <reference path="app.d.ts" />
import s = require("storageAdapters");
export declare module rMapper.Adapters {
    interface HTMLFileElement extends HTMLElement {
        files: FileList;
    }
    interface IRequirementsSourceAdapter {
        process(e: any): any;
    }
    class flatFileAdapter implements IRequirementsSourceAdapter {
        private store;
        constructor(dataStore: s.rMapper.Storage.IStorageProvider);
        process(e: HTMLFileElement): void;
    }
    class repositoryAdapter implements IRequirementsSourceAdapter {
        process(e: any): void;
    }
}
