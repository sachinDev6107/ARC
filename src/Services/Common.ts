// import { Column, ColumnModel, FilterSettingsModel, IFilter, PageSettingsModel, SelectionSettingsModel, ToolbarItems } from "@syncfusion/ej2-react-grids";


// export const filterSettings: FilterSettingsModel = {type: 'CheckBox'};
// export const pageSettings: PageSettingsModel = {pageSize: 8, pageCount: 4};
// export const activeToolbarOptions = ['Search','ExcelExport',{ text: 'Clear Filter', tooltipText: 'Clear Filter',prefixIcon: 'e-filter-clear', id: 'filterclear' }];

// export const DateString: any = {
//     months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],

//     shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',  'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

//     days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],

//     shortDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
//   };

//   export const sortComparerDate=(reference: string, comparer:  string)=>
//   {
//       var dateObjreference = new Date(reference);
//       var dateObjcomparer = new Date(comparer);
//       if (dateObjreference < dateObjcomparer) {
//           return -1;
//       }
//       if (dateObjreference > dateObjcomparer) {
//           return 1;
//       }
//       return 0;
//     };

//   export const sortComparerHyperLink=(reference: string, comparer:  string)=> {
//       if (reference.match(/<a [^>]+>([^<]+)<\/a>/)[1].toUpperCase() < comparer.match(/<a [^>]+>([^<]+)<\/a>/)[1].toUpperCase()) {
//           return -1;
//       }
//       if (reference.match(/<a [^>]+>([^<]+)<\/a>/)[1].toUpperCase() > comparer.match(/<a [^>]+>([^<]+)<\/a>/)[1].toUpperCase()) {
//           return 1;
//       }
//       return 0;
//   };

//   const multiLookupValueAccess = (field: string, data: any, column: Column) =>{
//     return data[field].results.map((s: any) => {
//       return s.Title
//     }).join(',');
//   }

//   // const dateValueAccess = (field: string, data: object, column: Column) =>{
//   //   var dt = new Date(data[field]);
//   //   return (dt.getDate()>=10?dt.getDate():"0"+dt.getDate()) + "," + DateString.shortMonths[dt.getMonth()] + " " + dt.getFullYear();
//   // }

//   export const dateValueAccess = (spDate:any) =>{
//     var dt = new Date(spDate);
//     return (dt.getDate()>=10?dt.getDate():"0"+dt.getDate()) + "-" + DateString.shortMonths[dt.getMonth()] + "-" + dt.getFullYear();
//   }

//   export const formatDate = (dt?: Date) =>{
//     return (dt.getDate()>=10?dt.getDate():"0"+dt.getDate()) + "-" + DateString.shortMonths[dt.getMonth()] + "-" + dt.getFullYear();
//   }

//   export const excelFileNameFormatDate = (dt?: Date) =>{
//     return (dt.getDate()>=10?dt.getDate():"0"+dt.getDate()) + " " + DateString.shortMonths[dt.getMonth()] + " " + dt.getFullYear();
//   }

//   export const formatDateTime = (date:any) => {
//     var date:any =new Date(date);
//     var hours = date.getHours();
//     let minutes:any = date.getMinutes();
//     var ampm = hours >= 12 ? 'PM' : 'AM';
//     hours = hours % 12;
//     hours = hours ? hours : 12; // the hour '0' should be '12'
//     minutes = minutes < 10 ? '0'+minutes : minutes;
//     var strTime = hours + ':' + minutes + ' ' + ampm;
//     return date.getDate() + "-" + DateString.shortMonths[(parseInt(date.getMonth()))] + "-" + date.getFullYear() + " " + strTime;
//   }


// export const _CreateColumnModel = (dashboardColumns:any) =>
// {
//   //let customColumns = [];
//   return (dashboardColumns.map((columnObj:any)=>{
//     let columnModel:ColumnModel = {
//       field:columnObj["backendName"],
//       headerText:columnObj["headerText"],
//       width:columnObj["width"],
//       disableHtmlEncode:columnObj["disableHtmlEncode"],
//       allowSorting:columnObj["allowSorting"],
//       allowFiltering:columnObj["allowFiltering"],
//       allowSearching:columnObj["allowSearching"],
//       type:columnObj["type"],
//       visible:columnObj["visible"],
//       //customAttributes:customStyleAttribute,
//     };
//     // if(columnObj["type"].toLocaleUpperCase()==="MULTILOOKUP")
//     // {
//     //     columnModel.valueAccessor=multiLookupValueAccess
//     // }

//     if(columnObj["type"].toLocaleUpperCase()==="BOOLEAN")
//     {
//         columnModel.displayAsCheckBox=true
//         columnModel.type="boolean"
//     }
//     if(columnObj["type"].toLocaleUpperCase()==="DATE"){
//       columnModel.type="text";
//      // columnModel.format
//       //columnModel.format = {type:'date',format:'dd-MMM-yyyy',skeleton:'full'};
//       //columnModel.valueAccessor = dateValueAccess;
//     }

//     /*if(columnObj["CustomSortingHyperLink"])
//     {
//       columnModel.sortComparer=sortComparerHyperLink;
//     }*/
//     if(columnObj.hasOwnProperty("CustomSortingDate"))
//     {
//       columnModel.sortComparer=sortComparerDate;
//     }
//     if(columnObj.hasOwnProperty("freeze"))
//     {
//       columnModel.freeze=columnObj["freeze"];
//     }
//     if(columnObj.hasOwnProperty("isPrimaryKey"))
//     {
//       columnModel.isPrimaryKey = true;
//     }
//     if(columnObj.hasOwnProperty("textAlign"))
//     {
//       columnModel.textAlign = columnObj["textAlign"];
//       //columnModel.customAttributes =  { class: 'orientationcss' };
//     }

//     return columnModel;
//   }));
// };

