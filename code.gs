const SHEET_URL = "https://docs.google.com/spreadsheets/d/1LzZ5qZoxlah7cicnsoZhCjJYbnyEdqkIQuMDSOrWyoE/edit";
const SHEET_NAME = "Sheet1";

function doGet(e) {
  const ss = SpreadsheetApp.openByUrl(SHEET_URL);
  const sheet = ss.getSheetByName(SHEET_NAME);

  // Read all existing IPs
  const data = sheet.getDataRange().getValues(); // assume first column is IP
  const ips = data.map(r => r[0]).filter(Boolean);

  // If IP provided, add it if new
  if (e.parameter.ip) {
    const ip = e.parameter.ip;
    if (!ips.includes(ip)) {
      sheet.appendRow([ip, new Date()]); // store IP and timestamp
      ips.push(ip);
      return ContentService.createTextOutput("New view");
    } else {
      return ContentService.createTextOutput("Returning visitor");
    }
  }

  // Return total unique views as JSON
  const total = ips.length;
  const json = { total: total };
  return ContentService.createTextOutput(JSON.stringify(json))
        .setMimeType(ContentService.MimeType.JSON);
}
