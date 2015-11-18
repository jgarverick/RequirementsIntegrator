var localStorageAdapter = (function () {
    function localStorageAdapter() {
    }
    localStorageAdapter.prototype.get = function (id) {
        return localStorage.getItem(id);
    };
    localStorageAdapter.prototype.set = function (id, value) {
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
//# sourceMappingURL=localStorageAdapter.js.map