define(["require", "exports"], function (require, exports) {
    let rMapper;
    (function (rMapper) {
        let Storage;
        (function (Storage) {
            let localStorageAdapter = (function () {
                function localStorageAdapter() {
                }
                localStorageAdapter.prototype.getItem = function (id) {
                    return localStorage.getItem(id);
                };
                localStorageAdapter.prototype.setItem = function (id, value) {
                    localStorage.setItem(id, value);
                };
                localStorageAdapter.prototype.clear = function () {
                    localStorage.clear();
                };
                localStorageAdapter.prototype.remove = function (id) {
                    localStorage.removeItem(id);
                };
                return localStorageAdapter;
            })();
            Storage.localStorageAdapter = localStorageAdapter;
            let VSODataServiceAdapter = (function () {
                function VSODataServiceAdapter() {
                }
                VSODataServiceAdapter.prototype.getItem = function (id) {
                    throw Error("Method not implemented.");
                };
                VSODataServiceAdapter.prototype.setItem = function (id, value) {
                    throw Error("Method not implemented.");
                };
                VSODataServiceAdapter.prototype.clear = function () {
                    throw Error("Method not implemented.");
                };
                VSODataServiceAdapter.prototype.remove = function (id) {
                    throw Error("Method not implemented.");
                };
                return VSODataServiceAdapter;
            })();
            Storage.VSODataServiceAdapter = VSODataServiceAdapter;
        })(Storage = rMapper.Storage || (rMapper.Storage = {}));
    })(rMapper = exports.rMapper || (exports.rMapper = {}));
});
//# sourceMappingURL=storageAdapters.js.map