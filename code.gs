// Slack Botの設定（出欠管理のやつ流用したらいい）
const SLACK_TOKEN = 'YOUR_SLACK_BOT_TOKEN'; // Slack Botのトークン
const APPROVAL_CHANNEL_ID = 'YOUR_SLACK_DM_CHANNEL_ID'; // グループリーダーのDMチャンネルのID

// 送信者の情報（署名用）
const LEADER_GRADE = 'M2';
const LEADER_NAME = 'YOUR_NAME';
const LEADER_NAME_EN = 'YOUR_ENGLISH_NAME';
const LAB_NAME = 'YOUR_LAB_NAME'; // 所属研究室名
const SENDER_ADDRESS = 'YOUR_MAIL_ADDRESS';

// 受信者情報
const RECIEVER_NAME = 'Gr.1'
const RECIEVER_ADDRESS = 'YOUR_RECIEVER_ADDRESS';

// イベント名
const EVENT_NAME = 'Gr.1 MTG';







/////////////////////////////////////////////////
/// 以下編集しないでください ////////////////////////
/////////////////////////////////////////////////

const SPREADSHEET = SpreadsheetApp.getActiveSpreadsheet()
const SHEET_PRESENTERS = SPREADSHEET.getSheetByName('Presenters');
const MATERIALS_URL = SHEET_PRESENTERS.getRange(1, 3).getRichTextValue().getLinkUrl();

function setMinTrigger(functionName, hour) {
  let triggers = ScriptApp.getProjectTriggers();
  for(let trigger of triggers){
    let funcName = trigger.getHandlerFunction();
    if(funcName == functionName){
      ScriptApp.deleteTrigger(trigger);
    }
  }
  let now = new Date();
  let y = now.getFullYear();
  let m = now.getMonth();
  let d = now.getDate();
  let date = new Date(y, m, d+1, hour, 00);
  ScriptApp.newTrigger(functionName).timeBased().at(date).create();
}


/**
 * 16時にSlackへ確認メッセージを送る
 */
function sendSlackConfirmation() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const values = SHEET_PRESENTERS.getDataRange().getValues();
  
  for (let i = 1; i < values.length; i++) {
    const mtgDate = values[i][0];
    const startTime = values[i][1];
    
    const targetDate = new Date(mtgDate);
    targetDate.setDate(targetDate.getDate() - 1);
    targetDate.setHours(0,0,0,0);

    if (targetDate.getTime() === today.getTime()) {
      let message = '';
      if (typeof startTime === 'string') {
        message = "【確認】明日はMTGの開始時刻が指定されていません．MTGがないのであればメールは送信されませんので放置して大丈夫です．もしMTGがある場合は17時までに開始時刻の記入，17時を過ぎた場合は手動でのメール送信お願いします，";
      } else {
        message = "【確認】明日のMTGのリマインドメールを17時に送信予定です．問題なければ放置してください！";
      }

      const payload = {
        token: SLACK_TOKEN,
        channel: APPROVAL_CHANNEL_ID,
        text: message
      };

      const options = {
        method: 'post',
        contentType: 'application/x-www-form-urlencoded',
        payload: payload
      };

      UrlFetchApp.fetch('https://slack.com/api/chat.postMessage', options);

      break;
    }
  }

  setMinTrigger('sendSlackConfirmation', 16);
}


/**
 * 17時にリマインドメールを送る
 */
function sendMTGReminderMail() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const values = SHEET_PRESENTERS.getDataRange().getValues();
  
  for (let i = 1; i < values.length; i++) {
    const mtgDate = values[i][0];
    const startTime = values[i][1];
    const place = values[i][2];

    const targetDate = new Date(mtgDate);
    targetDate.setDate(targetDate.getDate() - 1);
    targetDate.setHours(0,0,0,0);

    if (targetDate.getTime() === today.getTime()) {
      if (typeof startTime === 'string') {
        continue;
      }
      
      const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][mtgDate.getDay()];
      const formattedDate = Utilities.formatDate(mtgDate, 'Asia/Tokyo', 'M/dd');
      const formattedTime = Utilities.formatDate(startTime, 'Asia/Tokyo', 'H:mm');
      
      const mailBody = `
${RECIEVER_NAME}の皆様

${LEADER_GRADE} ${LEADER_NAME}です．

明日の${EVENT_NAME}について連絡します．
--------------------------
日時：${formattedDate}（${dayOfWeek}） ${formattedTime} ~
場所：${place}
--------------------------

MTG資料は以下のURLにアップロードしてください．
----------------------------------------------
${MATERIALS_URL}
----------------------------------------------

以上です．
よろしくお願いいたします．

-- 
----------------------------------------
立命館大学大学院
情報理工学研究科 情報理工学専攻
人間情報科学コース 2回生
${LAB_NAME}
${LEADER_NAME} <${LEADER_NAME_EN}>
E-mail： ${SENDER_ADDRESS}
----------------------------------------`;

      const subject = `${formattedDate}（${dayOfWeek}） ${EVENT_NAME}連絡`
      const options = {from: SENDER_ADDRESS};

      GmailApp.sendEmail(RECIEVER_ADDRESS, subject, mailBody, options);
      break;
    }
  }

  setMinTrigger('sendMTGReminderMail', 17);
}
