const SPREADSHEET_NAME = '2026_AI芳療活動';
const SPREADSHEET_ID_PROPERTY = 'SPREADSHEET_ID';
const HEADERS = ['姓名', 'Email', '單位', '電話', '職稱', '報名時間'];

function setup() {
  const properties = PropertiesService.getScriptProperties();
  const existingId = properties.getProperty(SPREADSHEET_ID_PROPERTY);
  if (existingId) {
    const existing = SpreadsheetApp.openById(existingId);
    Logger.log('報名試算表已設定：' + existing.getUrl());
    return existing.getUrl();
  }

  const spreadsheet = SpreadsheetApp.create(SPREADSHEET_NAME);
  const sheet = spreadsheet.getSheets()[0];
  sheet.setName('報名資料');
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  sheet.getRange('D:D').setNumberFormat('@');
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, HEADERS.length);
  properties.setProperty(SPREADSHEET_ID_PROPERTY, spreadsheet.getId());
  Logger.log('已建立報名試算表：' + spreadsheet.getUrl());
  return spreadsheet.getUrl();
}

function doPost(event) {
  const requestId = String((event && event.parameter && event.parameter.requestId) || '')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .slice(0, 80);

  try {
    if (!event || !event.parameter) {
      throw new Error('Missing form parameters');
    }

    const params = event.parameter;
    const name = clean_(params.name, 100);
    const email = clean_(params.email, 254);
    const unit = clean_(params.unit, 120);
    const phone = clean_(params.phone, 30);
    const title = clean_(params.title, 120);

    if (!name || !email || !phone) {
      throw new Error('Required registration fields are missing');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Invalid email address');
    }

    const spreadsheetId = PropertiesService.getScriptProperties()
      .getProperty(SPREADSHEET_ID_PROPERTY);
    if (!spreadsheetId) {
      throw new Error('Registration spreadsheet is not configured; run setup() first');
    }

    const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName('報名資料');
    if (!sheet) {
      throw new Error('Registration sheet was not found');
    }
    const row = sheet.getLastRow() + 1;
    const values = [name, email, unit, phone, title].map(safeSheetText_);
    sheet.getRange(row, 1, 1, values.length).setNumberFormat('@');
    sheet.getRange(row, 1, 1, values.length).setValues([values]);
    sheet.getRange(row, 6).setValue(new Date()).setNumberFormat('yyyy-mm-dd hh:mm:ss');

    return response_(requestId, true);
  } catch (error) {
    console.error(error && error.stack ? error.stack : error);
    return response_(requestId, false);
  }
}

function doGet() {
  return HtmlService.createHtmlOutput('Registration service is ready.');
}

function clean_(value, maxLength) {
  return String(value || '').trim().slice(0, maxLength);
}

function safeSheetText_(value) {
  return /^[=+\-@]/.test(value) ? "'" + value : value;
}

function response_(requestId, success) {
  const payload = JSON.stringify({
    type: 'registration-result',
    requestId: requestId,
    success: success
  }).replace(/</g, '\\u003c');
  const html = '<!doctype html><meta charset="utf-8"><script>' +
    'window.top.postMessage(' + payload + ',"*");' +
    '</script>';
  return HtmlService.createHtmlOutput(html)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
