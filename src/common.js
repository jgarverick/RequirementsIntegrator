define(["require", "exports", "src/utilities", "src/services", "VSS/Controls/Notifications", "VSS/Controls", "VSS/Controls/TreeView", "VSS/Controls/Menus"], function (require, exports, Utilities, Services, CommonControls, Controls, Treeview, Menus) {
    "use strict";
    var RequirementCollection = (function () {
        function RequirementCollection(source) {
            this.list = JSON.parse(source);
        }
        RequirementCollection.prototype.add = function (item) {
            this.list.push(item);
        };
        RequirementCollection.prototype.remove = function (item) {
            this.list.splice(this.list.indexOf(item), 1);
        };
        RequirementCollection.prototype.update = function (item) {
            this.list.forEach(function (itm, index) {
                if (itm.RequirementId == item.RequirementId) {
                    itm.Description = item.Description;
                    itm.Title = item.Title;
                    itm.MappedItems = item.MappedItems;
                    return;
                }
            });
        };
        RequirementCollection.prototype.toString = function () {
            return JSON.stringify(this.list);
        };
        RequirementCollection.prototype.getItem = function (id) {
            var req;
            this.list.forEach(function (itm, index) {
                if (itm.RequirementId == id) {
                    req = itm;
                    return;
                }
            });
            return req;
        };
        return RequirementCollection;
    }());
    exports.RequirementCollection = RequirementCollection;
    var ViewModelBase = (function () {
        function ViewModelBase() {
            this.projectId = VSS.getWebContext().project.id;
            this.messenger = new Services.MessageService();
            var self = this;
            self.nodes = new Array();
            var home = new Treeview.TreeNode("Requirements");
            home.link = "index.html";
            var sprints = new Treeview.TreeNode("Iteration Path View");
            sprints.link = "sprintView.html";
            var gaps = new Treeview.TreeNode("Gap Analysis");
            gaps.link = "gapAnalysis.html";
            self.nodes.push(home);
            self.nodes.push(sprints);
            self.nodes.push(gaps);
            self.tree = Controls.create(Treeview.TreeView, $('#treeMenu'), {
                nodes: self.nodes
            });
            var menu = Controls.create(Menus.MenuBar, $('#navToolbar'), {
                items: [
                    {
                        id: "getTemplate",
                        text: "Get Latest Template",
                        icon: "icon-download-package",
                        title: "Downloads the template for importing requirements via Excel"
                    }],
                executeAction: function (args) {
                    var command = args.get_commandName();
                    switch (command) {
                        case "getTemplate":
                            window.open(VSS.getExtensionContext().baseUri + "/data/SampleRequirements.xlsx");
                            break;
                    }
                }
            });
            Utilities.getProcessTemplate(self.projectId).then(function (result) {
                self.processTemplate = result.capabilities["processTemplate"]["templateName"];
            }, function (e) {
                self.messenger.displayMessage(e.message, CommonControls.MessageAreaType.Error);
            });
        }
        ViewModelBase.prototype.setActiveNode = function (nodeText) {
            var self = this;
            self.nodes.forEach(function (itm, idx) {
                if (itm.text == nodeText) {
                    self.tree.setSelectedNode(itm);
                    return;
                }
            });
        };
        ViewModelBase.prototype.validateTemplate = function (callback) {
            var self = this;
            setTimeout(function () {
                if (self.processTemplate.match("CMMI") != null) {
                    $('#reqtMenu').hide();
                    $("#content").show().append("<span>The CMMI process template allows you to manage requirements natively.  Import, export and reporting functionality has been disabled at this time.</span>");
                    self.messenger.displayMessage("Warning: CMMI process template detected.", CommonControls.MessageAreaType.Warning);
                }
                else {
                    callback();
                }
            }, 500);
        };
        return ViewModelBase;
    }());
    exports.ViewModelBase = ViewModelBase;
});
//# sourceMappingURL=common.js.map