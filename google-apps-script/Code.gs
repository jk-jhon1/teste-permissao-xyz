const SPREADSHEET_ID = '1zLpRhCdzw2Rum7NoRF-qyIsRy0uDqurJXy9Lbiu4yAo';
const SHEET_NAME = 'Respostas';
const HEADERS = [
  'Série',
  'Verifica a fonte',
  'Identificou sinais de manipulação',
  'Primeira atitude',
  'Consentimento informado'
];
const VALID_SERIES = ['1ª série', '2ª série', '3ª série'];
const YES_NO = ['Sim', 'Não'];
const ACTIONS = ['Conferir a fonte', 'Perguntar a alguém', 'Não compartilhar', 'Compartilhar'];

/** Public JSONP read endpoint. Only anonymous questionnaire fields are returned. */
function doGet(e) {
  const params = (e && e.parameter) || {};
  if (params.action !== 'list') return text_('Maklyn/Jhon survey endpoint');

  const callback = String(params.callback || '');
  if (!/^[A-Za-z_$][\w$]*$/.test(callback)) return text_('Invalid callback');

  const sheet = getResponseSheet_();
  const lastRow = sheet.getLastRow();
  const rows = lastRow < 2 ? [] : sheet.getRange(2, 1, lastRow - 1, 5).getDisplayValues()
    .filter(row => row.some(value => value !== ''))
    .map(row => ({
      serie: row[0],
      verificou_fonte: row[1],
      identificou_sinais: row[2],
      acao: row[3]
    }));

  return ContentService
    .createTextOutput(callback + '(' + JSON.stringify(rows) + ');')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

/** Anonymous form submission endpoint. No names, emails, or free-text answers are accepted. */
function doPost(e) {
  const params = (e && e.parameter) || {};

  // Honeypot field: silently discard likely bot submissions.
  if (String(params.website_extra || '').trim()) return text_('OK');

  const serie = String(params.serie || '').trim();
  const verifiesSource = String(params.verificou_fonte || '').trim();
  const identifiesSigns = String(params.identificou_sinais || '').trim();
  const firstAction = String(params.acao || '').trim();
  const consent = String(params.consentimento || '').trim();

  if (!VALID_SERIES.includes(serie) ||
      !YES_NO.includes(verifiesSource) ||
      !YES_NO.includes(identifiesSigns) ||
      !ACTIONS.includes(firstAction) ||
      consent !== 'Sim') {
    return text_('Resposta inválida ou consentimento ausente.');
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    getResponseSheet_().appendRow([serie, verifiesSource, identifiesSigns, firstAction, 'Sim']);
  } finally {
    lock.releaseLock();
  }
  return text_('OK');
}

function getResponseSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('A aba Respostas não foi encontrada.');
  if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
  return sheet;
}

function text_(value) {
  return ContentService.createTextOutput(value).setMimeType(ContentService.MimeType.TEXT);
}
