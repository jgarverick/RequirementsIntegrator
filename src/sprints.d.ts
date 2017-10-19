import Storage = require("Scripts/storage");
import Common = require("Scripts/common");
export declare module rMapper {
    interface IterationItem {
        name: string;
        children: Array<Common.Requirement>;
    }
    class SprintView extends Common.ViewModelBase implements Common.IStorageInit {
        storageAdapter: Storage.IStorageProvider;
        store: Storage.IStorageProvider;
        requirements: Array<Common.Requirement>;
        constructor(storageAdapter: Storage.IStorageProvider);
        start(): void;
        getSprints(): void;
    }
}
