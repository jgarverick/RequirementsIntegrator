/// <reference path='ref/VSS.d.ts' />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "TFS/WorkItemTracking/RestClient"], function (require, exports, TFS_Wit_WebApi) {
    var WorkItemExtensions;
    (function (WorkItemExtensions) {
        var BacklogHttpClient = (function (_super) {
            __extends(BacklogHttpClient, _super);
            function BacklogHttpClient() {
                _super.apply(this, arguments);
            }
            BacklogHttpClient.prototype.getBacklog = function (projectIdentifier) {
                var resourceParams = new Object();
                resourceParams.routeTemplate = "/" + projectIdentifier + "/_api/_backlog/payload";
                return this._beginRequestWithAjaxResult(resourceParams);
            };
            return BacklogHttpClient;
        })(TFS_Wit_WebApi.WorkItemTrackingHttpClient);
        WorkItemExtensions.BacklogHttpClient = BacklogHttpClient;
    })(WorkItemExtensions = exports.WorkItemExtensions || (exports.WorkItemExtensions = {}));
});
//# sourceMappingURL=backlog.js.map