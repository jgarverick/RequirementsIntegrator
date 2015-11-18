/// <reference path='ref/xlsx.d.ts' />
/// <reference path='model/requirement.d.ts' />
/// <reference path='app.d.ts' />
define(["require", "exports", "app"], function (require, exports, app) {
    var rMapper;
    (function (rMapper) {
        var Adapters;
        (function (Adapters) {
            var flatFileAdapter = (function () {
                function flatFileAdapter(dataStore) {
                    this.store = dataStore;
                }
                flatFileAdapter.prototype.process = function (e) {
                    var files = e.files;
                    var i, f;
                    f = files[0];
                    var reader = new FileReader();
                    var name = f.name;
                    reader.onload = function (e) {
                        var data = e.target.result;
                        try {
                            var workbook = XLSX.read(data, { type: 'binary' });
                            /* DO SOMETHING WITH workbook HERE */
                            var sheet_name_list = workbook.SheetNames;
                            sheet_name_list.forEach(function (y) {
                                var worksheet = workbook.Sheets[y];
                                var src = XLSX.utils.sheet_to_json(worksheet);
                                this.store.setItem("requirements", JSON.stringify(src));
                            });
                            $('#content').html('');
                            require(["VSS/Controls", "VSS/Controls/Grids"], function (Controls, Grids) {
                                Controls.create(Grids.Grid, $('#content'), {
                                    height: "300px",
                                    width: "70%",
                                    columns: [
                                        { text: "ID", index: "RequirementId", width: 75 },
                                        { text: "Summary", index: "Summary", width: 100 },
                                        { text: "Description", index: "Description", width: 300 }
                                    ],
                                    source: JSON.parse(this.store.getItem("requirements")),
                                    rowSelect: function (e) { }
                                });
                            });
                            $('#content').show();
                        }
                        catch (e) {
                            app.rMapper.displayMessage(e, app.rMapper.MessageType.Error);
                            $('#myFile').val('');
                            $('#content').html('');
                        }
                    };
                    reader.readAsBinaryString(f);
                };
                return flatFileAdapter;
            })();
            Adapters.flatFileAdapter = flatFileAdapter;
            var repositoryAdapter = (function () {
                function repositoryAdapter() {
                }
                repositoryAdapter.prototype.process = function (e) { };
                return repositoryAdapter;
            })();
            Adapters.repositoryAdapter = repositoryAdapter;
        })(Adapters = rMapper.Adapters || (rMapper.Adapters = {}));
    })(rMapper = exports.rMapper || (exports.rMapper = {}));
});
//# sourceMappingURL=sourceAdapters.js.map