interface IStorageProvider {
    get(id: string): any;
    set(id: string, value: string): any;
    clear(): any;
    remove(id: string): any;
}
declare class localStorageAdapter implements IStorageProvider {
    get(id: string): any;
    set(id: string, value: string): void;
    clear(): void;
    remove(id: string): void;
}
