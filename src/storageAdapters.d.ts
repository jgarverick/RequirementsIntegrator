export declare module rMapper.Storage {
    interface IStorageProvider {
        getItem(id: string): any;
        setItem(id: string, value: string): any;
        clear(): any;
        remove(id: string): any;
    }
    class localStorageAdapter implements IStorageProvider {
        getItem(id: string): any;
        setItem(id: string, value: string): void;
        clear(): void;
        remove(id: string): void;
    }
    class VSODataServiceAdapter implements IStorageProvider {
        getItem(id: string): void;
        setItem(id: string, value: string): void;
        clear(): void;
        remove(id: string): void;
    }
}
