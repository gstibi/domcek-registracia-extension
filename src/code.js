function sendEmail(e) {
  const values = e.values

  console.log("values", values)

  const {range} = e

  const lastCol = range.getLastColumn()
  const lastRow = range.getLastRow()
  // YYMMRRRR - 2xRok 2xMesiac 4xRiadok
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth() + 1
  const formattedMonth = month.toString().length < 2 ? "0" + month : month
  const row = 1000 + lastRow
  const variableSymbol = "" + year + formattedMonth + row

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheets()[0];
  // Passing only two arguments returns a "range" with a single cell.
  const sheetRange = sheet.getRange(lastRow, lastCol + 1);
  sheetRange.setValue(variableSymbol)

  const email = values[1]
  const subject = "Prihlasenie na put"
  const name = values[2]
  const message = name + " prihlasil si sa na put. " + "Variabilny symbol je: " + variableSymbol

  MailApp.sendEmail(email, subject, message)
}

function onOpen() {
  SpreadsheetApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
      .createMenu('Domček registrácia')
      .addItem('Maily', 'showLogInMailSidebar')
      .addToUi();
}

function showLogInMailSidebar() {
  var html = HtmlService.createTemplateFromFile('LogInMailTriggers')
      .evaluate()
      .setTitle('Domček registrácia');

  const ui = SpreadsheetApp.getUi()
  ui.showSidebar(html);
}

function getColumnHeaders() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const headers = sheet.getRange("1:1").getValues().flat().filter( val => val != "")
  console.log(headers)
  return headers
}

function createTrigger(hour) {
  var sheet = SpreadsheetApp.getActive();
  ScriptApp.newTrigger("sendEmail")
    .timeBased()
    .atHour(hour)
    .everyDays(1)
    .create()

  var triggers = ScriptApp.getProjectTriggers();
  Logger.log(triggers[0].getHandlerFunction)
}

function processMailingForm(input) {
  // overit vsetky inputy

  // pridat trigger
  console.log(input.triggerTime.split(":"))
  const hour = input.triggerTime.split(":")[0]
  createTrigger(hour)

}
  /**
 * Deletes a trigger.
 * @param {string} triggerId The Trigger ID.
 * @see https://developers.google.com/apps-script/guides/triggers/installable
 */
// function deleteTrigger(triggerId) {
//   // Loop over all triggers.
//   const allTriggers = ScriptApp.getProjectTriggers();
//   for (let index = 0; index < allTriggers.length; index++) {
//     // If the current trigger is the correct one, delete it.
//     if (allTriggers[index].getUniqueId() === triggerId) {
//       ScriptApp.deleteTrigger(allTriggers[index]);
//       break;
//     }
//   }
// }

 // Deletes all triggers in the current project.
//  function deleteAllTriggers() {
//   var triggers = ScriptApp.getProjectTriggers();
//   Logger.log(triggers)
//   for (var i = 0; i < triggers.length; i++) {
//     ScriptApp.deleteTrigger(triggers[i]);
//  }
//  }
 