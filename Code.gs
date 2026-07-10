// Spreadsheet Sheets Names
const REQUESTS_SHEET = "requests";
const CATEGORIES_SHEET = "categories";
const ACTIONS_SHEET = "actions";

// Headers mapping from Arabic/any sheet column name to English key for React
const HEADER_MAP = {
  // Requests headers mapping
  "id": "id",
  "الرقم": "id",
  "الرقم التعريفي": "id",
  "الاسم": "name",
  "اسم": "name",
  "التصنيف": "category",
  "رقم الوارد": "incomingNumber",
  "تاريخ الوارد": "incomingDate",
  "رقم واردنا": "ourNumber",
  "تاريخ واردنا": "ourDate",
  "من المكان": "fromPlace",
  "من": "fromPlace",
  "إلى المكان": "toPlace",
  "إلى": "toPlace",
  "ما تم فيه": "action",
  "الإجراء": "action",
  
  // Categories headers mapping
  "categoryName": "categoryName",
  "اسم التصنيف": "categoryName",
  "التصنيفات": "categoryName",
  
  // Actions headers mapping
  "actionName": "actionName",
  "اسم الإجراء": "actionName",
  "اسم القرار": "actionName",
  "القرارات": "actionName"
};

// HELPER: Convert raw sheet rows and headers to mapped array of objects
function getSheetData(sheet) {
  if (!sheet) return [];
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  
  const headers = data[0];
  const rows = data.slice(1);
  
  return rows.map((row, rowIndex) => {
    let obj = {};
    headers.forEach((header, colIndex) => {
      const headerStr = String(header).trim();
      const mappedKey = HEADER_MAP[headerStr] || headerStr;
      obj[mappedKey] = row[colIndex];
    });
    return obj;
  });
}

// GET DATA
function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const targetSheet = e && e.parameter && e.parameter.sheet;
  
  if (targetSheet) {
    const sheet = ss.getSheetByName(targetSheet);
    if (!sheet) return createJsonResponse({ error: "Sheet not found" });
    return createJsonResponse(getSheetData(sheet));
  }
  
  // Return all data in one payload to minimize roundtrips
  const requestsSheet = ss.getSheetByName(REQUESTS_SHEET);
  const categoriesSheet = ss.getSheetByName(CATEGORIES_SHEET);
  const actionsSheet = ss.getSheetByName(ACTIONS_SHEET);
  
  const payload = {
    requests: getSheetData(requestsSheet),
    categories: getSheetData(categoriesSheet),
    actions: getSheetData(actionsSheet)
  };
  
  return createJsonResponse(payload);
}

// POST DATA
function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const contents = JSON.parse(e.postData.contents);
    const type = contents.type || "request"; 
    const actionType = contents.actionType || "add"; 
    
    if (type === "category") {
      const sheet = ss.getSheetByName(CATEGORIES_SHEET);
      if (!sheet) return createJsonResponse({ success: false, message: "Categories sheet not found" });
      
      if (actionType === "add") {
        const rows = sheet.getDataRange().getValues();
        let nextId = 1;
        if (rows.length > 1) {
          const ids = rows.slice(1).map(r => parseInt(r[0])).filter(id => !isNaN(id));
          if (ids.length > 0) nextId = Math.max(...ids) + 1;
        }
        sheet.appendRow([nextId, contents.name]);
        return createJsonResponse({ success: true, message: "Category added", id: nextId, categoryName: contents.name });
      } 
      else if (actionType === "delete") {
        const idToDelete = parseInt(contents.id);
        const rows = sheet.getDataRange().getValues();
        let deleted = false;
        for (let i = 1; i < rows.length; i++) {
          if (parseInt(rows[i][0]) === idToDelete) {
            sheet.deleteRow(i + 1);
            deleted = true;
            break;
          }
        }
        return createJsonResponse({ success: deleted, message: deleted ? "Category deleted" : "Category ID not found" });
      }
    }
    
    if (type === "action") {
      const sheet = ss.getSheetByName(ACTIONS_SHEET);
      if (!sheet) return createJsonResponse({ success: false, message: "Actions sheet not found" });
      
      if (actionType === "add") {
        const rows = sheet.getDataRange().getValues();
        let nextId = 1;
        if (rows.length > 1) {
          const ids = rows.slice(1).map(r => parseInt(r[0])).filter(id => !isNaN(id));
          if (ids.length > 0) nextId = Math.max(...ids) + 1;
        }
        sheet.appendRow([nextId, contents.name]);
        return createJsonResponse({ success: true, message: "Action added", id: nextId, actionName: contents.name });
      } 
      else if (actionType === "delete") {
        const idToDelete = parseInt(contents.id);
        const rows = sheet.getDataRange().getValues();
        let deleted = false;
        for (let i = 1; i < rows.length; i++) {
          if (parseInt(rows[i][0]) === idToDelete) {
            sheet.deleteRow(i + 1);
            deleted = true;
            break;
          }
        }
        return createJsonResponse({ success: deleted, message: deleted ? "Action deleted" : "Action ID not found" });
      }
    }
    
    // Requests handlers
    if (type === "request") {
      const sheet = ss.getSheetByName(REQUESTS_SHEET);
      if (!sheet) return createJsonResponse({ success: false, message: "Requests sheet not found" });
      
      if (actionType === "add") {
        const rows = sheet.getDataRange().getValues();
        const headers = rows[0];
        const newRow = new Array(headers.length).fill("");
        
        headers.forEach((header, colIndex) => {
          const headerStr = String(header).trim();
          const mappedKey = HEADER_MAP[headerStr] || headerStr;
          if (mappedKey === "id") {
            newRow[colIndex] = new Date().getTime(); // timestamp
          } else if (contents[mappedKey] !== undefined) {
            newRow[colIndex] = contents[mappedKey];
          }
        });
        
        sheet.appendRow(newRow);
        return createJsonResponse({ success: true, message: "Request added successfully" });
      }
      
      else if (actionType === "edit") {
        const rows = sheet.getDataRange().getValues();
        const headers = rows[0];
        const idToEdit = String(contents.id);
        
        let idColIndex = 0;
        for (let j = 0; j < headers.length; j++) {
          if (HEADER_MAP[String(headers[j]).trim()] === "id") {
            idColIndex = j;
            break;
          }
        }
        
        let editedRowIndex = -1;
        for (let i = 1; i < rows.length; i++) {
          if (String(rows[i][idColIndex]) === idToEdit) {
            editedRowIndex = i + 1;
            break;
          }
        }
        
        if (editedRowIndex === -1) {
          return createJsonResponse({ success: false, message: "Request ID not found" });
        }
        
        headers.forEach((header, colIndex) => {
          const headerStr = String(header).trim();
          const mappedKey = HEADER_MAP[headerStr] || headerStr;
          if (mappedKey !== "id" && contents[mappedKey] !== undefined) {
            sheet.getRange(editedRowIndex, colIndex + 1).setValue(contents[mappedKey]);
          }
        });
        
        return createJsonResponse({ success: true, message: "Request updated successfully" });
      }
      
      else if (actionType === "delete") {
        const rows = sheet.getDataRange().getValues();
        const headers = rows[0];
        const idToDelete = String(contents.id);
        
        let idColIndex = 0;
        for (let j = 0; j < headers.length; j++) {
          if (HEADER_MAP[String(headers[j]).trim()] === "id") {
            idColIndex = j;
            break;
          }
        }
        
        let deleted = false;
        for (let i = 1; i < rows.length; i++) {
          if (String(rows[i][idColIndex]) === idToDelete) {
            sheet.deleteRow(i + 1);
            deleted = true;
            break;
          }
        }
        
        return createJsonResponse({ success: deleted, message: deleted ? "Request deleted" : "Request ID not found" });
      }
    }
    
    return createJsonResponse({ success: false, message: "Unknown post type or action" });
    
  } catch (error) {
    return createJsonResponse({ success: false, message: error.toString() });
  }
}

function createJsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
