# Requirements Integrator Extension for Visual Studio Team Services

## The Gist
This VSTS extension is intended to offer users the ability to import, map and analyze requirements as they relate to a team project.
### Features
- Import requirements from Excel (.xlsx)
- Manage requirement to work item mapping
- Display sprint view showing requirements covered by sprint
- Display traceability matrix, including gaps, for requirements imported and mapped to WIs
- Restrict import usage to non-CMMI process templates
- Requirement visualization (visual traceability)
- Export of requirement information to Excel

### Roadmap
- Support for referencing requirements from Sparx Enterprise Architect
- Support for referencing requirements from HP ALM

### Extensibility API Features Used
- Extension Data Service (IExtensionDataService, DocumentService)
- MessageArea Control
- Grid Control
- Work Item Tracking HttpClient
- Core HttpClient
- Child Dialogs (IHostDialogProvider)

Please see [overview](doc/overview.md) for an extended overview, including a walkthrough of how to use the extension.
 