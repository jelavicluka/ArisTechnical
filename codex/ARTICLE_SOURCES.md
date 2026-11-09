# Knowledge base articles — 7 November 2026

Four short English articles were adapted from the local knowledge base at
`C:/Users/developer/Desktop/ARIS`. Existing two integration articles are retained.

| Article slug | Local source and adaptation |
| --- | --- |
| `export-selected-model-names-to-excel` | `ARIS Reports/Project 2/Design Database Process Attributes and Counts.js`: selected model retrieval, selected-language names and Excel workbook/row/cell creation. Reduced to one column. |
| `count-function-occurrences-in-models` | Same report's model loop and occurrence counting, simplified using the documented `Model.ObjOccListFilter(int)` overload. Counts all `OT_FUNC` occurrences, including repeats and process-interface symbols of that object type. |
| `hide-database-switcher-in-aris-connect` | `ARIS Connect/Project 1/Config/resources/css/equinor.css`: `.cpn-header-section .comboDBSwitcher { display: none; }`. |
| `change-active-navigation-color-in-aris-connect` | Same stylesheet's `.navigationItem-selected` border rules for navigation lists and regular/collapsible navigation bars. Combined into one rule with a neutral example color. |

Report API signatures checked against the local ARIS 10.0.27 export:
`ARIS Reports/export/aris-api-docs.txt`, corresponding to
`r_O_ArisData_getselectedmodels`, `r_O_Context_createexcelworkbook` and
`r_O_Model_objocclistfilter2`.

Articles contain generic examples only; customer names, internal URLs, IDs and
the full source configurations are not included in published content.
CSS examples assume an already loaded custom stylesheet and the matching classic
Connect selectors. Their selectors were checked against the local source CSS.
Report scripts were executed with mocked ARIS APIs to check selected-language
names, counts, zero counts, empty selections and workbook writes. No ARIS server
or Connect instance was available to execute the examples in the product.

Website verification covered all six article routes, the homepage, library,
admin list, Connect category filter and HTTP responses. Browser-storage checks
covered importing into an existing saved library, preserving edits, avoiding
duplicate imports and retaining later article removals. Build and lint passed.
