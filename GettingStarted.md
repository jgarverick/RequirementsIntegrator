# Getting Started
To use the Requirements Integrator extension for the first time, you will want to follow the steps below.

## Importing Requirements
To import requirements, please be sure you are using a format that the extension can consume.  An Excel template can be downloaded from the "Get Latest Template" button in the left hand pane.
Once the template is populated with the information you wish to upload, click on the "Import" button to import the spreadsheet.  You will see the progress bar at the top of the dialog after you select the file, which is when the extension will process your file.  Once complete, click on the "OK" button to close the dialog.  You will see the Requirements pane refresh with the list of requirements that were just imported.

As more integration options are made available, this section will be updated to reflect each method of importing.

## Mapping Requirements to Work Items
To map a requirement to one or more work items, you may double-click on a requirement or use the context menu to select "Map Requirement".  This will open the mapping dialog.  There will be a dropdown list available, allowing you to select a work item type to map to.  For best results, it is recommended that you stick to the same level of work item (Epic, Feature, PBI or Task) for all mappings.
When you have selected the work item type, a list of applicable items will appear below the dropdown.  Place check marks in each of the checkboxes next to the items you wish to map to the requirement.  Clicking "Save" will save your selections and close the dialog.  You will see an informational message on the main screen alerting you to what was mapped to the requirement.

## Visualization
The Requirements Integrator extension allows you to visually see the impact of a requirement to the overall tree of work items.  Using the context menu, select "Visualize Requirement" to pull up a hierarchy diagram of the requirement and the team project's work items.  Each work item type is color coded (orange = epic, purple = feature, blue = PBI, yellow = task), and any mapped items will have a dark green border.  If no items are mapped, a message will display alerting you to the fact that nothing has been mapped to the requirement.

## Requirement Reporting
The Requirements Integrator extension comes with two reports out of the box:

- Iteration Path View: This report shows all scheduled iterations, along with any requirements that have been mapped to *scheduled* work items. If there are requirements mapped to unscheduled work items, they will not appear in this view.
- Gap Analysis View: This report shows all requirements and visually indicates those that are not mapped by displaying a red indicator in the "Mapped Items" column.  For those that are mapped, a green indicator is displayed along with a comma separated list of work item IDs.

## Exporting Requirements
To export your list of requirements, including any work item IDs that have been mapped, simply click on the "Export" button and an Excel file containing the information will be downloaded to your computer.

## Clearing Things Out
If for any reason you need to delete all of the imported requirements, click on the "Delete Requirements" button.  Keep in mind that this action is not reversible and will delete all requirements **and** associated mappings to work items.