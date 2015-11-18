/// <reference path="ref/VSS.d.ts" />
import TFS_Wit_WebApi = require("TFS/WorkItemTracking/RestClient");
export declare module WorkItemExtensions {
    class BacklogHttpClient extends TFS_Wit_WebApi.WorkItemTrackingHttpClient implements IBacklogQuery {
        getBacklog(projectIdentifier: string): Q.Promise<BacklogPayload>;
    }
    interface IBacklogQuery {
        getBacklog(projectIdentifier: string): IPromise<BacklogPayload>;
    }
    interface BacklogContext {
        filterCategoryRefName?: any;
        hubCategoryRefName: string;
        includeParents: boolean;
        isBacklog: boolean;
        portfolios: string[];
        requirementCategory: string;
        showInProgress: boolean;
    }
    interface AddPanelSettings {
        defaultWorkItemType: string;
        fieldRefNames: string[];
        projectId: string;
        settingsKey: string;
        visibleState: boolean;
        workItemTypes: string[];
    }
    interface CumulativeFlowDiagramSettings {
        categoryRefName: string;
        errors: any[];
        hideIncoming: boolean;
        isTeamAdmin: boolean;
        startDate?: any;
        title: string;
    }
    interface EffortData {
        effortFieldName: string;
        efforts: number[];
        ids: number[];
    }
    interface ForecastSettings {
        effortData: EffortData;
        velocity: number;
        visibleState: string;
    }
    interface TeamsMru {
        teamId: string;
        teamName: string;
    }
    interface MappingPanel {
        categoryPluralName: string;
        isVisible: boolean;
        teamsMru: TeamsMru[];
    }
    interface Column {
        canSortBy: boolean;
        fieldId: number;
        isIdentity: boolean;
        name: string;
        text: string;
        width: number;
    }
    interface Payload {
        columns: string[];
        rows: any[][];
    }
    interface ProductBacklogGridOptions {
        columnOptionsKey: string;
        enableForecast: boolean;
        enableReorder: boolean;
        enableReparent: boolean;
        showOrderColumn: boolean;
    }
    interface BacklogQueryResults {
        columns: Column[];
        isLinkQuery: boolean;
        isTreeQuery: boolean;
        linkIds: number[];
        pageColumns: string[];
        payload: Payload;
        queryRan: boolean;
        sortColumns: any[];
        sourceIds: number[];
        targetIds: number[];
        wiql: string;
        ownedIds: number[];
        productBacklogGridOptions: ProductBacklogGridOptions;
    }
    interface SprintView {
        actionName: string;
        selectedIteration: string;
    }
    interface VelocityChartSettings {
        errors: any[];
        iterationsNumber: number;
        title: string;
    }
    interface BacklogPayload {
        backlogContext: BacklogContext;
        inAdvertisingMode: boolean;
        addPanelSettings: AddPanelSettings;
        agilePortfolioManagementNotificationSettings?: any;
        backlogContextWorkItemTypeNames: string[];
        backlogOrderData?: any;
        backlogWorkItemTypeData?: any;
        cumulativeFlowDiagramSettings: CumulativeFlowDiagramSettings;
        forecastSettings: ForecastSettings;
        inProgressStates: string;
        isRequirementBacklog: boolean;
        isRootBacklog: boolean;
        mappingPanel: MappingPanel;
        mappingPanelFilterState?: any;
        pageTitle: string;
        pageTooltip: string;
        pluralName: string;
        queryResults: BacklogQueryResults;
        sprintView: SprintView;
        velocityChartSettings: VelocityChartSettings;
    }
}
