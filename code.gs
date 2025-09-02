function doGet(e) {
  const ss = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1LzZ5qZoxlah7cicnsoZhCjJYbnyEdqkIQuMDSOrWyoE/edit?usp=sharing");
  const sheet = ss.getSheetByName("Sheet1");

  // Get visitor IP
  const ip = e.parameter.ip;
  const data = sheet.getDataRange().getValues();
  let exists = false;

  // Check if IP already exists
  for (let i = 0; i < data.length; i++) {
    if (data[i][0] === ip) {
      exists = true;
      break;
    }
  }

  // If new, add IP
  if (!exists && ip) {
    sheet.appendRow([ip, new Date()]);
  }

  // Count total unique views
  const views = sheet.getLastRow();

  return ContentService
         .createTextOutput(JSON.stringify({views: views}))
         .setMimeType(ContentService.MimeType.JSON);
}
