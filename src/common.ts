//---------------------------------------------------------------------
// <copyright file="common.ts">
//    This code is licensed under the MIT License.
//    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF 
//    ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED 
//    TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
//    PARTICULAR PURPOSE AND NONINFRINGEMENT.
// </copyright>
// <summary>Common interfaces.</summary>
//---------------------------------------------------------------------
import Storage = require("../src/storage");
import Utilities = require("../src/utilities");
import Services = require("../src/services");
import CommonControls = require("VSS/Controls/Notifications");
import Controls = require("VSS/Controls");
import Treeview = require("VSS/Controls/TreeView");
import Menus = require("VSS/Controls/Menus");

export interface IAppInit {
    start();
}

export interface IStorageInit extends IAppInit {
    store: Storage.IStorageProvider;
    //new (s: Storage.IStorageProvider);
}

export interface Wiql {
    query: string;
}

export interface Requirement {
    RequirementId: string;
    Title: string;
    Description: string;
    MappedItems: string;
}

export interface ICollection<T> {
    add(item: T);
    remove(item: T);
    update(item: T);
    toString();
}

export class RequirementCollection implements ICollection<Requirement> {
    private list: Array<Requirement>;

    constructor(source: string) {
        this.list = JSON.parse(source);
    }
    add(item: Requirement) {
        this.list.push(item);
    }

    remove(item: Requirement) {
        this.list.splice(this.list.indexOf(item), 1);
    }

    update(item: Requirement) {
        this.list.forEach((itm, index) => {
            if (itm.RequirementId == item.RequirementId) {
                itm.Description = item.Description;
                itm.Title = item.Title;
                itm.MappedItems = item.MappedItems;
                return;
            }
        });
    }

    toString() {
        return JSON.stringify(this.list);
    }

    getItem(id: string) {
        let req: Requirement;
        this.list.forEach((itm, index) => {
            if (itm.RequirementId == id) {
                req = itm;
                return;
            }
        });
        return req;
    }
}

export class ViewModelBase {
    public processTemplate: string;
    public projectId: string = VSS.getWebContext().project.id;
    public messenger = new Services.messageService();
    public tree: Treeview.TreeView;
    public nodes: Array<Treeview.TreeNode>;

    constructor() {
        let self = this;
        self.nodes = new Array<Treeview.TreeNode>();
        let home = new Treeview.TreeNode("Requirements");
        home.link = "index.html";
        let sprints = new Treeview.TreeNode("Iteration Path View");
        sprints.link = "sprintView.html";
        let gaps = new Treeview.TreeNode("Gap Analysis");
        gaps.link = "gapAnalysis.html";
        self.nodes.push(home);
        self.nodes.push(sprints);
        self.nodes.push(gaps);


        self.tree = Controls.create(Treeview.TreeView, $('#treeMenu'), {
            nodes: self.nodes

        });

        let menu = Controls.create<Menus.MenuBar, any>(Menus.MenuBar, $('#navToolbar'), {
            items: [
                {
                    id: "getTemplate",
                    text: "Get Latest Template",
                    icon: "icon-download-package",
                    title: "Downloads the template for importing requirements via Excel"
                }],
            executeAction: (args) => {
                let command = args.get_commandName();
                switch (command) {
                    case "getTemplate":
                        window.open(VSS.getExtensionContext().baseUri + "/data/SampleRequirements.xlsx");
                        break;
                    
                }
            }
        });

        Utilities.getProcessTemplate(self.projectId).then((result) => {
            self.processTemplate = result.capabilities["processTemplate"]["templateName"];           
        }, (e) => {
            self.messenger.displayMessage(e.message, CommonControls.MessageAreaType.Error);
        });
    }

    setActiveNode(nodeText: string) {
        let self = this;
        self.nodes.forEach((itm, idx) => {
            if (itm.text == nodeText) {
                self.tree.setSelectedNode(itm);
                return;
            }
        });
    }

    validateTemplate(callback: Function) {
        let self = this;
        setTimeout(() => {
            if (self.processTemplate.match("CMMI") != null) {
                $('#reqtMenu').hide();
                $("#content").show().append("<span>The CMMI process template allows you to manage requirements natively.  Import, export and reporting functionality has been disabled at this time.</span>");
                self.messenger.displayMessage("Warning: CMMI process template detected.", CommonControls.MessageAreaType.Warning);
            } else {
                callback();
            }
        }, 500);
    }
}