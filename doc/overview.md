## Import and track requirements ##
This extension, located in the Visual Studio Team Services "Work" hub, gives you the ability to import, map, and view traceability for any outside requirements (business, functional, technical, etc.).  This will allow Agile and Scrum teams to have greater visibility into what is being addressed at the work item level, and also allow business stakeholders to see immediate gains based on scheduled work.
![Requirements](img/reqts.png)
### Requirement integration and traceability for Agile projects
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

### Quick steps to get started
1. Open the Visual Studio Online instance where you have installed the extension.
3. Select a project.
3. Navigate to **Work**.
4. The **Requirements hub** will show up.  Click on the link to continue.
5. Wait for the extension to load.  It will say there are no requirements.
6. Click on the **Get Latest Template** button to pull down the Excel file format to be used when importing requirements.
7. Fill in some general information into the spreadsheet.
8. Save the spreadsheet and exit.
9. Click on the **Import** button to open the dialog.
10. Choose the file to import.
11. Click **OK**.  This will refresh the requirements view. ![Screenshot1](img/screen1.png)
12. The new requirements will be shown.  Double-click on one to open the mapping dialog.
13. Choose PBI from the dropdown.  Map some stuff.  Click **Save**.  A message will display stating that the requirement was successfully mapped to the item(s) you selected.
14. Nav to **Iteration Path**.  It will show the remedial sprint view report.
15. Nav to **Gap Analysis**.  It will show the color-coded report depicting gaps in requirement mapping. ![Screenshot2](img/screen2.png)
16. Nav to **Requirements**.  
17. Click on **Export** to export the requirements, along with mapped items, into Excel.  For now, it is a simple view that contains the requirements data along with a column containing a comma-separated list of work items.  
18. Click on the context menu (left gutter or right-click requirement) and select **Visualize Requirement**.  This will open a new dialog that will draw out the work item tree, with the requiremnt shown as the pseudo parent.  Items that are directly mapped will have a thick green border around them to draw attention to them.
19. Click on any of the work item nodes to open the work item editor in a new tab/window. 
20. Close the editor, and close the visualization dialog.  Now select a requirement that you have not mapped anything to.
21. The dialog will open again, this time giving you an error message stating that nothing has been mapped to the requirement.  Close the dialog.
22. Click on **Delete** to show what happens.

### Learn more about this extension
The source to this extension is available on GitHub: [https://github.com/jgarverick/RequirementsIntegrator](https://github.com/jgarverick/RequirementsIntegrator).

Notices for certain third party software included in this extension are provided here: [Third Party Notice](https://marketplace.visualstudio.com/_apis/public/gallery/publisher/jgarverick/extension/jgarverick-vsoextensions-RequirementsManagement/latest/assetbyname/ThirdPartyNotice.txt).