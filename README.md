# 📄 README.md

## 概要
このプロジェクトは、SlackとGmailを利用して、研究室のミーティング連絡を自動化するスクリプトです．

---

## セットアップ手順

### 1. Gmailの設定
- 使用するGoogleアカウントで **Gmail** を開きます．
- 右上の「⚙（設定）」 → 「**すべての設定を表示**」をクリックします．
- 「アカウントとインポート」タブを開き、「**別のアドレスからメールを送信**」の項目で、**研究室のメールアドレス**を追加します．

---

### 2. スプレッドシートの作成
- ExcelファイルをGoogle Driveにアップロードします．
- アップロード後、**右クリック → Googleスプレッドシートとして開く**を選び、スプレッドシートに変換します．

---

### 3. スクリプト（GAS）のセットアップ
- スプレッドシート上部メニューから「拡張機能」→「Apps Script」を開きます．
- プロジェクトにある`.gs`ファイルの内容をコピペします．

---

### 4. 必要な変数の編集
スクリプト冒頭にある以下の変数を、自分用に書き換えます．

```javascript
// Slack Botの設定
const SLACK_TOKEN = '（自分のSlack Botトークン）';
const APPROVAL_CHANNEL_ID = '（リーダーのSlack DMチャンネルID）';

// 送信者の情報（署名用）
const LEADER_GRADE = '（学年）'; // 例：M2, B4 など
const LEADER_NAME = '（名前）';
const LEADER_NAME_EN = '（英語の名前）';
const RESEARCHER_NAME = '（研究室名）';
const SENDER_ADDRESS = '（自分のメルアド）';

// 受信者情報
const RECIEVER_NAME = 'Gr.1';
const RECIEVER_ADDRESS = '（受信者のメルアド）';

// イベント名
const EVENT_NAME = 'Gr.1 MTG';
```

---

### 5. トリガーの設定
「トリガー」から次の設定を行います．

| 関数名 | 時間 | 内容 |
|:------|:----|:----|
| Slack通知関数（例：`sendSlackConfirmation`） | 毎日 16:00 | Slackにリマインドを送信 |
| メール送信関数（例：`sendMTGReminderMail`） | 毎日 17:00 | Gmailからリマインドメールを送信 |

---

## 注意事項
- トークンやメールアドレス情報は漏洩しないよう注意してください．
- スクリプトやトリガーの設定後は、手動で一度実行して権限を付与してください．

---

# ✅ 完了！
