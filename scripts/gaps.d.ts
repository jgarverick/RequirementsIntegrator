import Common = require("Scripts/common");
import Storage = require("Scripts/storage");
export declare module rMapper {
    class GapAnalysis extends Common.ViewModelBase implements Common.IStorageInit {
        store: Storage.IStorageProvider;
        constructor(storageAdapter: Storage.IStorageProvider);
        start(): void;
    }
}
